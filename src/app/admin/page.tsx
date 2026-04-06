'use client';

import { motion } from 'framer-motion';
import {
  FiTrendingUp,
  FiUsers,
  FiDownload,
  FiFilter,
  FiArrowRight,
  FiActivity,
  FiShoppingBag,
  FiArrowUpRight,
} from 'react-icons/fi';

const AdminOverview = () => {
  const kpiData = [
    {
      label: 'Doanh thu tháng',
      value: '248,930,000đ',
      trend: '+12.4%',
      icon: FiTrendingUp,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
    },
    {
      label: 'Nhà bán hàng',
      value: '1,204',
      trend: '+8.2%',
      icon: FiUsers,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      label: 'Tổng người mua',
      value: '48.5K',
      trend: '+15.1%',
      icon: FiShoppingBag,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
  ];

  const recentActivity = [
    {
      id: 1,
      title: 'Hợp tác xã mật ong Lâm Đồng',
      action: 'Được phê duyệt mới',
      time: '12 phút trước',
      status: 'success',
    },
    {
      id: 2,
      title: 'Cảnh báo hệ thống',
      action: 'Lưu lượng truy cập tăng đột biến tại phía Bắc',
      time: '45 phút trước',
      status: 'warning',
    },
    {
      id: 3,
      title: 'Sơn La Coffee',
      action: 'Cập nhật danh mục sản phẩm',
      time: '2 giờ trước',
      status: 'info',
    },
  ];

  const topCategories = [
    { name: 'Trà Đặc Sản', share: 72, items: 428, revenue: '84.2Mđ', trend: '+18.5%' },
    { name: 'Cà Phê Cao Cấp', share: 58, items: 315, revenue: '62.1Mđ', trend: '+12.2%' },
    { name: 'Gia Vị Hữu Cơ', share: 45, items: 892, revenue: '45.8Mđ', trend: '-2.4%' },
  ];

  return (
    <div className="space-y-10">
      {/* Page Header */}
      <div className="flex justify-between items-end">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h2 className="text-3xl font-black text-emerald-900 tracking-tight leading-none mb-3">
            Quản trị viên Tổng quan
          </h2>
          <p className="text-stone-500 text-sm font-medium">
            Giám sát tăng trưởng khu vực và chỉ số thị trường OCOP.
          </p>
        </motion.div>

        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-5 py-2.5 bg-white text-stone-600 text-xs font-bold rounded-xl border border-stone-200 hover:bg-stone-50 transition-all shadow-sm">
            <FiFilter /> Lọc chế độ xem
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white text-xs font-bold rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20">
            <FiDownload /> Xuất dữ liệu
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {kpiData.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white p-6 rounded-3xl shadow-sm border border-stone-100 relative group overflow-hidden"
          >
            <div
              className={`absolute top-0 right-0 w-24 h-24 ${stat.bg} rounded-full -mr-8 -mt-8 opacity-50 group-hover:scale-110 transition-transform duration-500`}
            />
            <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-3 relative z-10">
              {stat.label}
            </p>
            <h3 className="text-2xl font-black text-stone-900 mb-3 relative z-10">{stat.value}</h3>
            <div className="flex items-center gap-1.5 relative z-10">
              <span
                className={`flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full ${stat.color} ${stat.bg}`}
              >
                {stat.trend} <FiArrowUpRight />
              </span>
              <span className="text-[10px] font-bold text-stone-400 italic">
                so với tháng trước
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Middle Section: Chart & Activity */}
      <div className="grid grid-cols-12 gap-8">
        {/* Chart Area - Placeholder for now */}
        <div className="col-span-12 lg:col-span-8 bg-white p-8 rounded-3xl shadow-sm border border-stone-100 overflow-hidden relative group">
          <div className="flex justify-between items-center mb-8">
            <h4 className="text-lg font-black text-stone-900 tracking-tight">
              Xu hướng Doanh thu & Tăng trưởng
            </h4>
            <div className="flex gap-4">
              <span className="flex items-center gap-2 text-[10px] font-black text-stone-400 uppercase tracking-widest">
                <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" /> Doanh thu
              </span>
              <span className="flex items-center gap-2 text-[10px] font-black text-stone-400 uppercase tracking-widest">
                <span className="w-2.5 h-2.5 rounded-sm bg-blue-400" /> Đơn hàng
              </span>
            </div>
          </div>

          <div className="h-64 bg-stone-50 rounded-2xl flex items-center justify-center border border-dashed border-stone-200">
            {/* Simulated Chart using Frame Motion or SVG */}
            <div className="text-stone-300 flex flex-col items-center">
              <FiActivity size={48} className="animate-pulse mb-3" />
              <span className="text-xs font-bold uppercase tracking-widest">
                Biểu đồ đang hiển thị dữ liệu thời gian thực
              </span>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <div className="bg-white text-gray-900 p-8 rounded-3xl shadow-xl shadow-emerald-900/20 relative overflow-hidden group">
            <FiShoppingBag className="absolute -right-8 -bottom-8 text-[160px] text-white/5 group-hover:rotate-12 transition-transform duration-700" />
            <h4 className="text-[10px] font-black uppercase tracking-widest mb-6 opacity-70">
              Tổng quan đơn hàng
            </h4>
            <div className="space-y-6 relative z-10">
              <div>
                <div className="flex justify-between items-end mb-2">
                  <span className="text-2xl font-black">12,402</span>
                  <span className="text-[10px] font-black uppercase opacity-60">Đã xử lý</span>
                </div>
                <div className="h-2 w-full bg-gray-900/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '85%' }}
                    className="h-full bg-blue-400 rounded-full"
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between items-end mb-2">
                  <span className="text-2xl font-black">842</span>
                  <span className="text-[10px] font-black uppercase opacity-60">Đang chờ</span>
                </div>
                <div className="h-2 w-full bg-gray-900/10  rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '15%' }}
                    className="h-full bg-emerald-400 rounded-full"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-100">
            <h4 className="text-[10px] font-black text-stone-900 uppercase tracking-widest mb-6">
              Hoạt động gần đây
            </h4>
            <div className="space-y-5">
              {recentActivity.map((act) => (
                <div key={act.id} className="flex gap-4 group cursor-pointer">
                  <div className="w-8 h-8 rounded-xl bg-stone-50 flex items-center justify-center shrink-0 border border-stone-100 group-hover:bg-emerald-50 transition-colors">
                    <FiActivity className="text-emerald-600 text-xs" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-stone-800 line-clamp-1">{act.title}</p>
                    <p className="text-[10px] text-stone-400 font-bold">
                      {act.action} • {act.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Categories Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-stone-100 overflow-hidden">
        <div className="px-8 py-6 flex justify-between items-center border-b border-stone-50 bg-stone-50/50">
          <h4 className="text-lg font-black text-stone-900 tracking-tight">
            Danh mục sản phẩm hàng đầu
          </h4>
          <button className="text-emerald-600 text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 hover:text-emerald-700 transition-colors">
            Xem toàn bộ <FiArrowRight />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-black text-stone-400 uppercase tracking-widest">
                <th className="px-8 py-5">Danh mục</th>
                <th className="px-8 py-5">Thị phần</th>
                <th className="px-8 py-5">Sản phẩm</th>
                <th className="px-8 py-5">Doanh thu (30 ngày)</th>
                <th className="px-8 py-5 text-right">Tăng trưởng</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {topCategories.map((cat) => (
                <tr
                  key={cat.name}
                  className="hover:bg-stone-50 transition-colors group cursor-pointer"
                >
                  <td className="px-8 py-5">
                    <span className="text-sm font-black text-stone-900">{cat.name}</span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-1.5 bg-stone-100 rounded-full max-w-[100px] overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${cat.share}%` }}
                          className="h-full bg-emerald-500 rounded-full"
                        />
                      </div>
                      <span className="text-[10px] font-black text-stone-400">{cat.share}%</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-xs font-bold text-stone-600">{cat.items} sản phẩm</span>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-xs font-black text-stone-900">{cat.revenue}</span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <span
                      className={`text-[10px] font-black px-2 py-0.5 rounded-full ${cat.trend.startsWith('+') ? 'text-emerald-600 bg-emerald-50' : 'text-red-600 bg-red-50'}`}
                    >
                      {cat.trend}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
