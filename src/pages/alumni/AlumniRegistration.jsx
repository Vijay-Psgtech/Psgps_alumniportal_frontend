import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  AlertCircle,
  Check,
  ChevronDown,
  Eye,
  EyeOff,
  LocateFixed,
  MapPin,
  Upload,
  UserRound,
  X,
} from "lucide-react";
import { authAPI } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import usePageTitle from "../../hooks/usePageTitle";

const BATCHES = Array.from({ length: 75 }, (_, index) => {
  const start = new Date().getFullYear() - index;
  return `${start - 2}-${start}`;
});

const STREAMS = ["Science", "Management"];

const initialForm = {
  firstName: "",
  lastName: "",
  gender: "",
  contactNumber: "",
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
  resState: "",
  resCountry: "",
  resCoordinates: [],
};

const Field = ({ label, required, error, children, className = "" }) => (
  <div className={`space-y-2 ${className}`}>
    <label className="block text-sm font-semibold text-slate-700">
      {label} {required && <span className="text-blue-600">*</span>}
    </label>
    {children}
    {error && (
      <p className="flex items-center gap-1 text-xs text-red-600">
        <AlertCircle size={13} /> {error}
      </p>
    )}
  </div>
);

const inputClass = (error) =>
  `w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 ${
    error ? "border-red-400 bg-red-50/30" : "border-slate-200 hover:border-slate-300"
  }`;

const Select = ({ error, children, ...props }) => (
  <div className="relative">
    <select {...props} className={`${inputClass(error)} appearance-none pr-10`}>
      {children}
    </select>
    <ChevronDown
      size={17}
      className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
    />
  </div>
);

const AlumniRegistration = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState(initialForm);
  const [photo, setPhoto] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  usePageTitle("Alumni Registration");

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
      } catch (error) {
        if (error.name !== "AbortError") setSuggestions([]);
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
    setErrors((current) => ({ ...current, [name]: undefined }));
  };

  const selectCity = (place) => {
    const address = place.address || {};
    setForm((current) => ({
      ...current,
      resCity:
        address.city ||
        address.town ||
        address.village ||
        address.state_district ||
        place.display_name.split(",")[0],
      resState: address.state || current.resState,
      resCountry: address.country || current.resCountry,
      resCoordinates: [Number(place.lon), Number(place.lat)],
    }));
    setSuggestions([]);
    setErrors((current) => ({ ...current, resCity: undefined }));
  };

  const validate = () => {
    const nextErrors = {};
    if (!form.firstName.trim()) nextErrors.firstName = "First name is required";
    if (!form.gender) nextErrors.gender = "Select your gender";
    if (!/^\d{10}$/.test(form.contactNumber.replace(/\s/g, ""))) {
      nextErrors.contactNumber = "Enter a valid 10-digit number";
    }
    if (!form.batchYear) nextErrors.batchYear = "Select your batch";
    if (!form.stream) nextErrors.stream = "Select your stream";
    if (!form.occupation.trim()) nextErrors.occupation = "Occupation is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      nextErrors.email = "Enter a valid email address";
    }
    if (form.password.length < 6) nextErrors.password = "Use at least 6 characters";
    if (form.password !== form.confirmPassword) {
      nextErrors.confirmPassword = "Passwords do not match";
    }
    if (!photo) nextErrors.currentPhoto = "Current photo is required";
    if (!form.resAddress1.trim()) nextErrors.resAddress1 = "Address is required";
    if (!form.resCity.trim()) nextErrors.resCity = "City is required";
    if (!form.resState.trim()) nextErrors.resState = "State is required";
    if (!form.resCountry.trim()) nextErrors.resCountry = "Country is required";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const submit = async (event) => {
    event.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setErrors({});

    try {
      const formData = new FormData();
      formData.append("firstName", form.firstName.trim());
      formData.append("lastName", form.lastName.trim());
      formData.append("gender", form.gender);
      formData.append("phone", form.contactNumber.trim());
      formData.append("batchYear", form.batchYear);
      formData.append("stream", form.stream);
      formData.append("occupation", form.occupation.trim());
      formData.append("company", form.company.trim());
      formData.append("email", form.email.toLowerCase().trim());
      formData.append("password", form.password);
      formData.append("city", form.resCity.trim());
      formData.append("country", form.resCountry.trim());
      formData.append(
        "fullAddress",
        [form.resAddress1, form.resAddress2, form.resCity, form.resState, form.resCountry]
          .filter(Boolean)
          .join(", "),
      );
      formData.append("coordinates", JSON.stringify(form.resCoordinates));
      if (photo) formData.append("currentPhoto", photo);

      const response = await authAPI.register(formData);
      const alumni = response.data?.data || response.data?.alumni;
      if (alumni) {
        await login({
          ...alumni,
          alumniId: alumni.alumniId || alumni._id || alumni.id,
        });
      }
      setRegistered(true);
    } catch (error) {
      setErrors({
        general:
          error.response?.data?.message ||
          "Registration failed. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (registered) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 p-5">
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-xl shadow-slate-200/60"
        >
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
            <Check size={30} />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Registration submitted</h1>
          <p className="mt-3 text-sm leading-6 text-slate-500">
            Your profile is now waiting for admin approval. We will notify you when your account is ready.
          </p>
          <button
            type="button"
            onClick={() => navigate("/")}
            className="mt-7 w-full rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Return to home
          </button>
        </motion.section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#eef4fb] px-4 py-8 sm:px-6 lg:px-10 lg:py-14">
      <div className="mx-auto grid w-full max-w-6xl overflow-hidden rounded-3xl bg-white shadow-2xl shadow-blue-900/10 lg:grid-cols-[0.82fr_1.5fr]">
        <aside className="relative overflow-hidden bg-[#073b72] px-7 py-10 text-white sm:px-10 lg:px-12 lg:py-14">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full border-[28px] border-white/10" />
          <div className="relative flex h-full flex-col">
            <div className="flex items-center gap-3 text-sm font-semibold tracking-wide text-blue-100">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                <UserRound size={20} />
              </span>
              PSG Public Schools
            </div>
            <div className="mt-16 max-w-sm lg:mt-auto">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-blue-200">Join the network</p>
              <h1 className="mt-4 text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
                Your story belongs here.
              </h1>
              <p className="mt-5 max-w-xs text-sm leading-7 text-blue-100/80">
                Create your alumni profile and stay connected to the people and places that shaped you.
              </p>
            </div>
            <p className="mt-12 text-xs text-blue-200/70 lg:mt-16">A community that keeps moving forward.</p>
          </div>
        </aside>

        <section className="px-5 py-8 sm:px-10 sm:py-12 lg:px-14 lg:py-14">
          <div className="mb-9">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">Alumni registration</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Build your profile</h2>
            <p className="mt-2 text-sm text-slate-500">Tell us a little about yourself. Fields marked with * are required.</p>
          </div>

          {errors.general && (
            <div className="mb-6 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <AlertCircle size={16} /> {errors.general}
            </div>
          )}

          <form onSubmit={submit} className="space-y-9">
            <div>
              <div className="mb-5 flex items-center gap-3">
                <span className="h-px flex-1 bg-slate-200" />
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Personal details</span>
                <span className="h-px flex-1 bg-slate-200" />
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="First name" required error={errors.firstName}>
                  <input name="firstName" value={form.firstName} onChange={updateField} placeholder="e.g. Arjun" className={inputClass(errors.firstName)} />
                </Field>
                <Field label="Last name" error={errors.lastName}>
                  <input name="lastName" value={form.lastName} onChange={updateField} placeholder="e.g. Kumar" className={inputClass(errors.lastName)} />
                </Field>
                <Field label="Gender" required error={errors.gender}>
                  <Select name="gender" value={form.gender} onChange={updateField} error={errors.gender}>
                    <option value="">Select gender</option>
                    <option>Male</option><option>Female</option><option>Other</option>
                  </Select>
                </Field>
                <Field label="Contact number" required error={errors.contactNumber}>
                  <input type="tel" name="contactNumber" value={form.contactNumber} onChange={updateField} placeholder="98765 43210" className={inputClass(errors.contactNumber)} />
                </Field>
              </div>
            </div>

            <div>
              <div className="mb-5 flex items-center gap-3">
                <span className="h-px flex-1 bg-slate-200" />
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Alumni details</span>
                <span className="h-px flex-1 bg-slate-200" />
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Batch" required error={errors.batchYear}>
                  <Select name="batchYear" value={form.batchYear} onChange={updateField} error={errors.batchYear}>
                    <option value="">Select batch</option>
                    {BATCHES.map((batch) => <option key={batch}>{batch}</option>)}
                  </Select>
                </Field>
                <Field label="Stream" required error={errors.stream}>
                  <Select name="stream" value={form.stream} onChange={updateField} error={errors.stream}>
                    <option value="">Select stream</option>
                    {STREAMS.map((stream) => <option key={stream}>{stream}</option>)}
                  </Select>
                </Field>
                <Field label="Occupation" required error={errors.occupation} >
                  <input name="occupation" value={form.occupation} onChange={updateField} placeholder="e.g. Software Engineer" className={inputClass(errors.occupation)} />
                </Field>
                <Field label="Company" error={errors.company} >
                  <input name="company" value={form.company} onChange={updateField} placeholder="e.g. Infosys" className={inputClass(errors.company)} />
                </Field>
              </div>
            </div>

            <div>
              <div className="mb-5 flex items-center gap-3">
                <span className="h-px flex-1 bg-slate-200" />
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Account access</span>
                <span className="h-px flex-1 bg-slate-200" />
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Email" required error={errors.email} className="sm:col-span-2">
                  <input type="email" name="email" value={form.email} onChange={updateField} placeholder="you@example.com" autoComplete="email" className={inputClass(errors.email)} />
                </Field>
                <Field label="Password" required error={errors.password}>
                  <div className="relative">
                    <input type={showPassword ? "text" : "password"} name="password" value={form.password} onChange={updateField} placeholder="At least 6 characters" autoComplete="new-password" className={`${inputClass(errors.password)} pr-12`} />
                    <button type="button" aria-label="Toggle password visibility" onClick={() => setShowPassword((current) => !current)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700">
                      {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  </div>
                </Field>
                <Field label="Confirm password" required error={errors.confirmPassword}>
                  <div className="relative">
                    <input type={showConfirmPassword ? "text" : "password"} name="confirmPassword" value={form.confirmPassword} onChange={updateField} placeholder="Repeat your password" autoComplete="new-password" className={`${inputClass(errors.confirmPassword)} pr-12`} />
                    <button type="button" aria-label="Toggle confirm password visibility" onClick={() => setShowConfirmPassword((current) => !current)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700">
                      {showConfirmPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  </div>
                </Field>
              </div>
            </div>

            <div>
              <div className="mb-5 flex items-center gap-3">
                <span className="h-px flex-1 bg-slate-200" />
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Photo and address</span>
                <span className="h-px flex-1 bg-slate-200" />
              </div>
              <div className="space-y-5">
                <Field label="Current photo" required error={errors.currentPhoto}>
                  <label className={`flex cursor-pointer items-center justify-between rounded-xl border border-dashed px-4 py-4 transition ${errors.currentPhoto ? "border-red-400 bg-red-50/30" : "border-slate-300 hover:border-blue-400 hover:bg-blue-50/30"}`}>
                    <span className="flex min-w-0 items-center gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600"><Upload size={18} /></span>
                      <span className="min-w-0"><span className="block truncate text-sm font-semibold text-slate-700">{photo ? photo.name : "Upload a recent photo"}</span><span className="block text-xs text-slate-400">JPG or PNG, up to 5 MB</span></span>
                    </span>
                    {photo && <button type="button" aria-label="Remove photo" onClick={(event) => { event.preventDefault(); setPhoto(null); }} className="ml-3 text-slate-400 hover:text-red-500"><X size={17} /></button>}
                    <input type="file" accept="image/jpeg,image/png" className="hidden" onChange={(event) => setPhoto(event.target.files?.[0] || null)} />
                  </label>
                </Field>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Address 1" required error={errors.resAddress1}><input name="resAddress1" value={form.resAddress1} onChange={updateField} placeholder="House number and street" className={inputClass(errors.resAddress1)} /></Field>
                  <Field label="Address 2" error={errors.resAddress2}><input name="resAddress2" value={form.resAddress2} onChange={updateField} placeholder="Area or landmark" className={inputClass(errors.resAddress2)} /></Field>
                  <Field label="City" required error={errors.resCity} className="relative sm:col-span-2">
                    <div className="relative"><input name="resCity" value={form.resCity} onChange={updateField} placeholder="Start typing your city" autoComplete="off" className={`${inputClass(errors.resCity)} pr-11`} /><LocateFixed size={17} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" /></div>
                    {(suggestions.length > 0 || loadingSuggestions) && <div className="absolute left-0 right-0 top-full z-20 mt-2 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">{loadingSuggestions ? <p className="px-4 py-3 text-xs text-slate-500">Finding places...</p> : suggestions.map((place) => <button type="button" key={place.place_id} onClick={() => selectCity(place)} className="flex w-full items-start gap-2 border-b border-slate-100 px-4 py-3 text-left text-xs text-slate-600 last:border-0 hover:bg-blue-50"><MapPin size={14} className="mt-0.5 shrink-0 text-blue-500" />{place.display_name}</button>)}</div>}
                  </Field>
                  <Field label="State" required error={errors.resState}><input name="resState" value={form.resState} onChange={updateField} placeholder="e.g. Tamil Nadu" className={inputClass(errors.resState)} /></Field>
                  <Field label="Country" required error={errors.resCountry}><input name="resCountry" value={form.resCountry} onChange={updateField} placeholder="e.g. India" className={inputClass(errors.resCountry)} /></Field>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4 border-t border-slate-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-500">Already registered? <Link to="/alumni/login" className="font-semibold text-blue-600 hover:underline">Sign in</Link></p>
              <button type="submit" disabled={loading} className="rounded-xl bg-blue-600 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60">{loading ? "Submitting..." : "Create alumni profile"}</button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
};

export default AlumniRegistration;
