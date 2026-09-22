import React, { useState, useEffect, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { adminReportsAPI, API_BASE } from "../../services/api";
import usePageTitle from "../../hooks/usePageTitle";

const formatNumber = (value) => new Intl.NumberFormat().format(value);

const AdminReports = () => {
  const [totalAlumniCount, setTotalAlumniCount] = useState(0);
  const [alumniData, setAlumniData] = useState([]);
  const [alumniList, setAlumniList] = useState([]);
  const [departmentData, setDepartmentData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  usePageTitle("Admin Reports");

  useEffect(() => {
    const fetchAlumniData = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await adminReportsAPI.fetchAlumniDataByYear();
        const data = res?.data?.data;

        if (data) {
          setTotalAlumniCount(data.totalCount || 0);
          setAlumniData(data.countByYear || []);
          setAlumniList(data.allAlumni || []);
        } else {
          setError("No data returned from the server.");
        }
      } catch (fetchError) {
        setError(fetchError?.message || "Failed to load report data.");
      } finally {
        setLoading(false);
      }
    };

    fetchAlumniData();
  }, []);

  useEffect(() => {
    const fetchAlumniDataByDepartment = async () => {
      try {
        const res = await adminReportsAPI.fetchAlumniDataByDepartment();
        const data = res?.data?.data;
        if (data) {
          setDepartmentData(data.countByDepartment || []);
        }
      } catch (fetchError) {
        console.error("Failed to load alumni data by department:", fetchError);
      }
    };
    fetchAlumniDataByDepartment();
  }, []);

  const chartData = useMemo(() => {
    return (alumniData || [])
      .slice()
      .sort((a, b) => Number(a.year) - Number(b.year));
  }, [alumniData]);

  const recentAlumni = useMemo(() => {
    return alumniList.slice(0, 10);
  }, [alumniList]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-blue-50 mt-16 p-4 sm:p-6 lg:p-24">
      <header className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-semibold text-slate-800">
          Admin Reports
        </h1>
        <p className="mt-1 text-sm text-slate-600 max-w-2xl">
          Keep an eye on alumni growth and engagement. Use this dashboard to
          monitor recent sign-ups and year-over-year registration trends.
        </p>
      </header>

      {loading ? (
        <div className="rounded-xl bg-white p-8 shadow-sm border border-dashed border-slate-300">
          <p className="text-center text-slate-600">Loading report data…</p>
        </div>
      ) : error ? (
        <div className="rounded-xl bg-rose-50 p-6 shadow-sm border border-rose-200">
          <p className="text-sm text-rose-700">{error}</p>
        </div>
      ) : (
        <>
          <section className="grid gap-6 lg:grid-cols-3 mb-8">
            <div className="rounded-xl bg-white p-6 shadow-sm border border-slate-200">
              <h2 className="text-sm font-semibold text-slate-500">
                Total Alumni
              </h2>
              <p className="mt-2 text-3xl font-semibold text-slate-800">
                {formatNumber(totalAlumniCount)}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                As of {new Date().toLocaleDateString()}
              </p>
            </div>

            <div className="rounded-xl bg-white p-6 shadow-sm border border-slate-200">
              <h2 className="text-sm font-semibold text-slate-500">
                Year range
              </h2>
              <p className="mt-2 text-3xl font-semibold text-slate-800">
                {chartData.length > 0
                  ? `${chartData[0].year} – ${chartData[chartData.length - 1].year}`
                  : "—"}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Years represented in enrollment data
              </p>
            </div>

            <div className="rounded-xl bg-white p-6 shadow-sm border border-slate-200">
              <h2 className="text-sm font-semibold text-slate-500">
                Latest Signups
              </h2>
              <p className="mt-2 text-3xl font-semibold text-slate-800">
                {formatNumber(recentAlumni.length)}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Most recent {recentAlumni.length} alumni loaded
              </p>
            </div>
          </section>

          <section className="grid gap-6 lg:grid-cols-2 mb-8">
            <div className="rounded-xl bg-white p-6 shadow-sm border border-slate-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-lg font-semibold text-slate-800">
                  Alumni by Year
                </h2>
                <p className="mt-2 sm:mt-0 text-sm text-slate-500">
                  Year-over-year registration counts
                </p>
              </div>

              <div className="mt-6 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                  >
                    <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                    <YAxis tickFormatter={(value) => formatNumber(value)} />
                    <Tooltip formatter={(value) => formatNumber(value)} />
                    <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            

            <div className="rounded-xl bg-white p-6 shadow-sm border border-slate-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-lg font-semibold text-slate-800">
                  Alumni by Department
                </h2>
                <p className="mt-2 sm:mt-0 text-sm text-slate-500">
                  Distribution of alumni across departments
                </p>
              </div>

              <div className="mt-6 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={departmentData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                      label={({ department, percent }) => `${department} ${(percent * 100).toFixed(0)}%`}
                    >
                      {departmentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={['#0088FE', '#00C49F', '#FFBB28', '#FF8042'][index % 4]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatNumber(value)} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </section>
          <div className="rounded-xl bg-white p-6 shadow-sm border border-slate-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-lg font-semibold text-slate-800">
                  Recently Registered Alumni
                </h2>
                <p className="mt-2 sm:mt-0 text-sm text-slate-500">
                  Showing the most recent records
                </p>
              </div>

              <div className="mt-6">
                <div className="hidden md:block overflow-x-auto">
                  <table className="min-w-full text-sm text-left border border-gray-200">
                    <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                      <tr>
                        <th className="py-3 px-4 border-b">Name</th>
                        <th className="py-3 px-4 border-b">Batch</th>
                        <th className="py-3 px-4 border-b">Branch</th>
                        <th className="py-3 px-4 border-b">Email</th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-700">
                      {recentAlumni.map((alumni) => (
                        <tr
                          key={alumni._id || alumni.email}
                          className="hover:bg-gray-50"
                        >
                          <td className="py-3 px-4 border-b flex items-center gap-3 font-medium">
                            <img
                              src={
                                alumni.profileImage
                                  ? `${API_BASE}/${alumni.profileImage}`
                                  : "/default-avatar.png"
                              }
                              alt={`${alumni.firstName || ""} ${alumni.lastName || ""}`}
                              className="w-8 h-8 rounded-full border object-cover"
                            />
                            {alumni.firstName} {alumni.lastName || ""}
                          </td>
                          <td className="py-3 px-4 border-b">
                            {alumni.batchYear || "—"}
                          </td>
                          <td className="py-3 px-4 border-b">
                            {alumni.department || "—"}
                          </td>
                          <td className="py-3 px-4 border-b">
                            {alumni.email || "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="space-y-4 md:hidden">
                  {recentAlumni.map((alumni) => (
                    <div
                      key={alumni._id || alumni.email}
                      className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                    >
                      <div className="flex items-center gap-3">
                        {alumni.files?.currentPhoto ? (
                          <img
                            src={`${API_BASE}/uploads/${alumni.files?.currentPhoto}`}
                            alt={`${alumni.firstName || ""} ${alumni.lastName || ""}`}
                            className="w-10 h-10 rounded-full border object-cover"
                          />
                        ) : (
                          <img
                            src="/default-avatar.png"
                            alt={`${alumni.firstName || ""} ${alumni.lastName || ""}`}
                            className="w-10 h-10 rounded-full border object-cover"
                          />
                        )}

                        <div>
                          <p className="text-sm font-semibold text-slate-800">
                            {alumni.firstName} {alumni.lastName || ""}
                          </p>
                          <p className="text-xs text-slate-500">
                            {alumni.email || "—"}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-slate-600">
                        <div className="rounded-lg bg-white p-2 shadow-sm">
                          <p className="font-medium text-slate-700">Batch</p>
                          <p>{alumni.batchYear || "—"}</p>
                        </div>
                        <div className="rounded-lg bg-white p-2 shadow-sm">
                          <p className="font-medium text-slate-700">Branch</p>
                          <p>{alumni.department || "—"}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
        </>
      )}
    </div>
  );
};

export default AdminReports;
