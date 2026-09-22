import React, { useCallback, useEffect, useState } from "react";
import { AlertCircle, Camera, Check, Edit3, Eye, EyeOff, LocateFixed, LogOut, MapPin, Save, UserRound, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { alumniAPI, API_BASE, authAPI } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import usePageTitle from "../../hooks/usePageTitle";

const STREAMS = ["Science", "Management"];
const initialForm = {
    firstName: "",
    lastName: "",
    gender: "",
    phone: "",
    batchYear: "",
    stream: "",
    occupation: "",
    company: "",
    email: "",
    password: "",
    confirmPassword: "",
    resAddress1: "",
    resAddress2: "",
    resCity: "",
    city: "",
    resState: "",
    state: "",
    resCountry: "",
    country: "",
    resCoordinates: [],
    location: [],
    currentPhoto: "",
};

const inputClass =
    "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10";

const Field = ({ label, required, children, className = "" }) => (
    <label className={`block space-y-2 ${className}`}>
        <span className="block text-sm font-semibold text-slate-700">
            {label} {required && <span className="text-blue-600">*</span>}
        </span>
        {children}
    </label>
);

const normalizeProfile = (data) => {
    const profile = data?.alumni || data?.user || data?.data || data || {};
    const coordinates = Array.isArray(profile.resCoordinates)
        ? profile.resCoordinates
        : Array.isArray(profile.coordinates)
            ? profile.coordinates
            : Array.isArray(profile.location?.coordinates)
                ? profile.location.coordinates
                : [];
    const address = profile.fullAddress || "";
    const addressParts = address.split(",").map((part) => part.trim()).filter(Boolean);

    return {
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        gender: profile.gender || "",
        phone: profile.phone || profile.contactNumber || "",
        batchYear: profile.batchYear || "",
        stream: profile.stream || "",
        occupation: profile.occupation || "",
        company: profile.company || "",
        email: profile.email || "",
        password: "",
        confirmPassword: "",
        resAddress1: profile.resAddress1 || addressParts[0] || "",
        resAddress2: profile.resAddress2 || addressParts[1] || "",
        resCity: profile.resCity || profile.city || "",
        city: profile.city || profile.resCity || "",
        resState: profile.resState || profile.state || addressParts[3] || "",
        state: profile.state || profile.resState || "",
        resCountry: profile.resCountry || profile.country || addressParts[4] || "",
        country: profile.country || profile.resCountry || "",
        resCoordinates: coordinates,
        location: Array.isArray(profile.location?.coordinates) ? profile.location.coordinates : coordinates,
        currentPhoto: profile.files?.currentPhoto || profile.currentPhoto || "",
    };
};

const AlumniProfile = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [form, setForm] = useState(initialForm);
    const [profileId, setProfileId] = useState("");
    const [photo, setPhoto] = useState(null);
    const [existingPhoto, setExistingPhoto] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [loadingSuggestions, setLoadingSuggestions] = useState(false);
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    usePageTitle(`Profile - ${form.firstName || "Alumni"}`);

    const loadProfile = useCallback(async () => {
        try {
            setLoading(true);
            setError("");
            const response = await authAPI.getProfile();
            const rawProfile = response.data?.alumni || response.data?.user || response.data?.data || response.data;
            if (!rawProfile) throw new Error("Profile data not found");
            setProfileId(rawProfile._id || rawProfile.id || "");
            const nextForm = normalizeProfile(rawProfile);
            setForm(nextForm);
            setExistingPhoto(nextForm.currentPhoto || rawProfile.files?.currentPhoto || rawProfile.currentPhoto || "");
        } catch (requestError) {
            if (requestError.response?.status === 401) navigate("/alumni/login");
            else setError(requestError.response?.data?.message || requestError.message || "Unable to load your profile.");
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    useEffect(() => {
        loadProfile();
    }, [loadProfile]);

    useEffect(() => {
        if (form.resCity.trim().length < 3 || form.resCoordinates.length) {
            setSuggestions([]);
            return undefined;
        }

        const controller = new AbortController();
        const timeout = setTimeout(async () => {
            setLoadingSuggestions(true);
            try {
                const response = await fetch(
                    `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=6&q=${encodeURIComponent(form.resCity)}`,
                    { signal: controller.signal },
                );
                setSuggestions(await response.json());
            } catch (requestError) {
                if (requestError.name !== "AbortError") setSuggestions([]);
            } finally {
                setLoadingSuggestions(false);
            }
        }, 350);

        return () => {
            clearTimeout(timeout);
            controller.abort();
        };
    }, [form.resCity, form.resCoordinates.length]);

    const updateField = (event) => {
        const { name, value } = event.target;
        setForm((current) => ({
            ...current,
            [name]: value,
            ...(name === "resCity" ? { resCoordinates: [] } : {}),
        }));
        setError("");
    };

    const selectCity = (place) => {
        const address = place.address || {};
        setForm((current) => ({
            ...current,
            resCity: address.city || address.town || address.village || address.state_district || place.display_name.split(",")[0],
            resState: address.state || current.resState,
            resCountry: address.country || current.resCountry,
            resCoordinates: [Number(place.lon), Number(place.lat)],
        }));
        setSuggestions([]);
    };

    const validate = () => {
        if (!form.firstName.trim() || !form.gender || !/^\d{10}$/.test(form.phone.replace(/\s/g, "")) || !form.batchYear || !form.stream || !form.occupation.trim() || !form.company.trim() || !form.email.trim() || !form.resAddress1.trim() || !form.resCity.trim() || !form.resState.trim() || !form.resCountry.trim()) {
            setError("Please complete all required fields.");
            return false;
        }
        return true;
    };

    const saveProfile = async (event) => {
        event.preventDefault();
        if (!validate()) return;

        try {
            setSaving(true);
            setError("");
            const normalizedCity = (form.resCity || form.city || "").trim();
            const normalizedState = (form.resState || form.state || "").trim();
            const normalizedCountry = (form.resCountry || form.country || "").trim();
            const locationCoordinates = form.resCoordinates?.length ? form.resCoordinates : form.location || [];

            const formData = new FormData();
            formData.append("firstName", form.firstName.trim());
            formData.append("lastName", form.lastName.trim());
            formData.append("gender", form.gender);
            formData.append("phone", form.phone.trim());
            formData.append("batchYear", form.batchYear);
            formData.append("stream", form.stream);
            formData.append("occupation", form.occupation.trim());
            formData.append("company", form.company.trim());
            formData.append("email", form.email.toLowerCase().trim());
            formData.append("city", normalizedCity);
            formData.append("state", normalizedState);
            formData.append("country", normalizedCountry);
            formData.append("fullAddress", [form.resAddress1, form.resAddress2, normalizedCity, normalizedState, normalizedCountry].filter(Boolean).join(", "));
            formData.append("location", JSON.stringify(locationCoordinates));
            formData.append("coordinates", JSON.stringify(locationCoordinates));
            if (photo) formData.append("currentPhoto", photo);

            const response = await alumniAPI.updateProfile(profileId, formData);
            const responseProfile = response.data?.alumni || response.data?.user || response.data?.data;
            setForm(responseProfile ? normalizeProfile(responseProfile) : { ...form, password: "", confirmPassword: "" });
            setPhoto(null);
            setForm((current) => ({ ...current, password: "", confirmPassword: "" }));
            setEditing(false);
            setSuccess("Profile updated successfully.");
            setTimeout(() => setSuccess(""), 4000);
        } catch (requestError) {
            setError(requestError.response?.data?.message || "Unable to update your profile.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="flex min-h-screen items-center justify-center bg-[#eef4fb] text-sm text-slate-500">Loading your profile...</div>;
    }

    return (
        <main className="min-h-screen bg-[#eef4fb] px-4 py-10 sm:px-6 lg:py-16">
            <div className="mx-auto max-w-4xl">
                <header className="mb-7 flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">PSG Public Schools</p>
                        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">My alumni profile</h1>
                        <p className="mt-2 text-sm text-slate-500">Update the same information used during alumni registration.</p>
                    </div>
                    <div className="flex gap-2">
                        {!editing && <button type="button" onClick={() => setEditing(true)} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-blue-700"><Edit3 size={16} /> Edit profile</button>}
                        <button type="button" onClick={() => { logout(); navigate("/"); }} className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50">
                            <LogOut size={16} /> Log out
                        </button>
                    </div>
                </header>

                {(error || success) && <div className={`mb-5 flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium ${error ? "border-red-200 bg-red-50 text-red-700" : "border-emerald-200 bg-emerald-50 text-emerald-700"}`}>
                    {error ? <AlertCircle size={16} /> : <Check size={16} />}{error || success}{error && <button type="button" onClick={() => setError("")} className="ml-auto"><X size={15} /></button>}
                </div>}

                {editing ? <form onSubmit={saveProfile} className="rounded-3xl bg-white p-5 shadow-xl shadow-blue-900/10 sm:p-8 lg:p-10">
                    <div className="mb-8 flex items-center gap-4 border-b border-slate-100 pb-6">
                        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-blue-50 text-xl font-bold text-blue-700">
                            {photo ? <img src={URL.createObjectURL(photo)} alt="Selected profile" className="h-full w-full object-cover" /> : existingPhoto ? <img src={`${API_BASE}/uploads/${existingPhoto}`} alt="Current profile" className="h-full w-full object-cover" /> : <UserRound size={27} />}
                        </div>
                        <div><p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">Profile information</p><h2 className="mt-1 text-xl font-bold text-slate-900">{form.firstName || "Alumni"} {form.lastName}</h2><p className="mt-1 text-sm text-slate-500">Fields marked * are required.</p></div>
                    </div>

                    <div className="space-y-9">
                        <section><SectionTitle title="Personal details" /><div className="grid gap-5 sm:grid-cols-2"><Field label="First name" required><input name="firstName" value={form.firstName} onChange={updateField} className={inputClass} /></Field><Field label="Last name"><input name="lastName" value={form.lastName} onChange={updateField} className={inputClass} /></Field><Field label="Gender" required><select name="gender" value={form.gender} onChange={updateField} className={`${inputClass} cursor-pointer`}><option value="">Select gender</option><option>Male</option><option>Female</option><option>Other</option></select></Field><Field label="Phone" required><input name="phone" type="tel" value={form.phone} onChange={updateField} placeholder="98765 43210" className={inputClass} /></Field></div></section>

                        <section><SectionTitle title="Alumni details" /><div className="grid gap-5 sm:grid-cols-2"><Field label="Batch" required><input name="batchYear" value={form.batchYear} readOnly className={`${inputClass} cursor-not-allowed bg-slate-100 text-slate-500`} /></Field><Field label="Stream" required><input name="stream" value={form.stream} readOnly className={`${inputClass} cursor-not-allowed bg-slate-100 text-slate-500`} /></Field><Field label="Occupation" required ><input name="occupation" value={form.occupation} onChange={updateField} className={inputClass} /></Field><Field label="Company" required ><input name="company" value={form.company} onChange={updateField} className={inputClass} /></Field></div></section>

                        <section><SectionTitle title="Account access" /><div className="grid gap-5 sm:grid-cols-2"><Field label="Email" required className="sm:col-span-2"><input name="email" type="email" value={form.email} readOnly className={`${inputClass} cursor-not-allowed bg-slate-100 text-slate-500`} /></Field></div></section>

                        <section><SectionTitle title="Photo and address" /><div className="grid gap-5 sm:grid-cols-2"><Field label="Current photo" className="sm:col-span-2"><label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-slate-300 px-4 py-4 hover:border-blue-400 hover:bg-blue-50/30"><Camera size={20} className="text-blue-600" /><span className="min-w-0 flex-1 truncate text-sm font-semibold text-slate-700">{photo?.name || (existingPhoto ? "Replace current photo" : "Upload a recent photo")}</span><input type="file" accept="image/jpeg,image/png" className="hidden" onChange={(event) => setPhoto(event.target.files?.[0] || null)} /></label></Field><Field label="Address 1" required><input name="resAddress1" value={form.resAddress1} onChange={updateField} placeholder="House number and street" className={inputClass} /></Field><Field label="Address 2"><input name="resAddress2" value={form.resAddress2} onChange={updateField} placeholder="Area or landmark" className={inputClass} /></Field><Field label="City" required className="relative sm:col-span-2"><div className="relative"><input name="resCity" value={form.resCity} onChange={updateField} placeholder="Start typing your city" autoComplete="off" className={`${inputClass} pr-11`} /><LocateFixed size={17} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" /></div>{(suggestions.length > 0 || loadingSuggestions) && <div className="absolute left-0 right-0 top-full z-10 mt-2 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">{loadingSuggestions ? <p className="px-4 py-3 text-xs text-slate-500">Finding places...</p> : suggestions.map((place) => <button type="button" key={place.place_id} onClick={() => selectCity(place)} className="flex w-full items-start gap-2 border-b border-slate-100 px-4 py-3 text-left text-xs text-slate-600 last:border-0 hover:bg-blue-50"><MapPin size={14} className="mt-0.5 shrink-0 text-blue-500" />{place.display_name}</button>)}</div>}</Field><Field label="State" required><input name="resState" value={form.resState} onChange={updateField} placeholder="e.g. Tamil Nadu" className={inputClass} /></Field><Field label="Country" required><input name="resCountry" value={form.resCountry} onChange={updateField} placeholder="e.g. India" className={inputClass} /></Field></div></section>
                    </div>

                    <div className="mt-9 flex flex-col gap-3 border-t border-slate-100 pt-6 sm:flex-row"><button type="submit" disabled={saving} className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"><Save size={17} />{saving ? "Saving profile..." : "Save profile"}</button><button type="button" onClick={() => setEditing(false)} className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 px-6 py-3.5 text-sm font-bold text-slate-600 hover:bg-slate-50"><X size={17} /> Cancel</button></div>
                </form> : <ProfileSummary form={form} existingPhoto={existingPhoto} />}
            </div>
        </main>
    );
};

const ProfileSummary = ({ form, existingPhoto }) => {
    const value = (field) => form[field] || "Not provided";
    const rows = [
        ["First name", value("firstName")],
        ["Last name", value("lastName")],
        ["Gender", value("gender")],
        ["Phone", value("phone")],
    ];
    const address = [form.resAddress1, form.resAddress2, form.resCity, form.resState, form.resCountry]
        .filter(Boolean)
        .join(", ");

    return (
        <section className="space-y-5">
            <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
                <SummaryCard title="Personal details" icon={UserRound}>
                    {rows.map(([label, item]) => <SummaryRow key={label} label={label} value={item} />)}
                </SummaryCard>
                <SummaryCard title="Profile photo" icon={Camera}>
                    <div className="flex items-center gap-4 py-4">
                        <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-blue-50 text-blue-600">
                            {existingPhoto ? <img src={`${API_BASE}/uploads/${existingPhoto}`} alt="Current profile" className="h-full w-full object-cover" /> : <Camera size={28} />}
                        </div>
                        <div><p className="text-sm font-semibold text-slate-800">Current photo</p><p className="mt-1 text-xs text-slate-500">{existingPhoto ? "Uploaded" : "Not uploaded"}</p></div>
                    </div>
                </SummaryCard>
            </div>
            <div className="grid gap-5 lg:grid-cols-2">
                <SummaryCard title="Alumni details" icon={UserRound}>
                    <SummaryRow label="Batch" value={value("batchYear")} />
                    <SummaryRow label="Stream" value={value("stream")} />
                    <SummaryRow label="Occupation" value={value("occupation")} />
                    <SummaryRow label="Company" value={value("company")} />
                    <SummaryRow label="Email" value={value("email")} />
                </SummaryCard>
                <SummaryCard title="Residential address" icon={MapPin}>
                    <SummaryRow label="Address" value={address || "Not provided"} />
                    <SummaryRow label="City" value={value("resCity")} />
                    <SummaryRow label="State" value={value("resState")} />
                    <SummaryRow label="Country" value={value("resCountry")} />
                    <SummaryRow label="Coordinates" value={form.resCoordinates?.length === 2 ? `${form.resCoordinates[1]}, ${form.resCoordinates[0]}` : "Not selected"} />
                </SummaryCard>
            </div>
        </section>
    );
};

const SummaryCard = ({ title, icon: Icon, children }) => (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-blue-900/10">
        <header className="flex items-center gap-3 border-b border-slate-100 bg-slate-50/70 px-5 py-4">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 text-blue-600"><Icon size={17} /></span>
            <h2 className="text-sm font-bold uppercase tracking-[0.14em] text-slate-700">{title}</h2>
        </header>
        <div className="px-5"><div className="divide-y divide-slate-100">{children}</div></div>
    </section>
);

const SummaryRow = ({ label, value }) => (
    <div className="flex flex-col gap-1 py-4 sm:flex-row sm:items-start sm:justify-between sm:gap-5">
        <span className="text-xs font-bold uppercase tracking-[0.12em] text-slate-400">{label}</span>
        <span className={`break-words text-sm font-semibold sm:max-w-[65%] sm:text-right ${value === "Not provided" || value === "Not selected" ? "text-slate-300" : "text-slate-800"}`}>{value}</span>
    </div>
);

const SectionTitle = ({ title }) => <div className="mb-5 flex items-center gap-3"><span className="h-px flex-1 bg-slate-200" /><span className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">{title}</span><span className="h-px flex-1 bg-slate-200" /></div>;

const PasswordField = ({ label, name, value, visible, onChange, toggle }) => <Field label={label}><div className="relative"><input name={name} type={visible ? "text" : "password"} value={value} onChange={onChange} placeholder="Leave blank to keep current password" className={`${inputClass} pr-12`} /><button type="button" aria-label={`Toggle ${label.toLowerCase()}`} onClick={toggle} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700">{visible ? <EyeOff size={17} /> : <Eye size={17} />}</button></div></Field>;

export default AlumniProfile;
