import { QrCode, ScanLine } from 'lucide-react';

export function QRTraceabilitySection() {
  return (
    <section className="w-full max-w-7xl mx-auto px-6 py-12 md:py-20">
      <div className="w-full relative bg-red-100 rounded-xl md:rounded-[56px] overflow-hidden flex flex-col md:flex-row items-center justify-between p-8 md:p-16 lg:p-24 gap-12 shadow-sm border border-red-200">
        {/* Background decorations */}
        <div className="w-96 h-96 absolute -left-24 -top-24 bg-green-900/5 rounded-full blur-3xl mix-blend-multiply" />
        <div className="w-96 h-96 absolute -right-24 -bottom-24 bg-stone-700/5 rounded-full blur-3xl mix-blend-multiply" />

        {/* Text Content */}
        <div className="relative z-10 flex-1 max-w-xl flex flex-col justify-start items-start gap-8">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-sans leading-[1.1] md:leading-[1.1] tracking-tight">
            <span className="text-stone-700 font-extrabold block mb-2">Truy xuất nguồn gốc</span>
            <span className="text-green-900 font-light">trong nháy mắt</span>
          </h2>

          <p className="text-stone-600 text-lg md:text-xl font-normal font-sans leading-8">
            Mỗi sản phẩm tại OCOP Market đều được gắn mã QR duy nhất. Chỉ cần một lần quét, bạn sẽ
            biết rõ hành trình từ trang trại đến tay bạn, thông tin hộ nông dân và các chứng chỉ
            kiểm định.
          </p>

          <div className="w-full pt-4 grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-12 border-t border-stone-200/50 mt-4">
            <div className="flex flex-col justify-start items-start gap-1 md:gap-2">
              <div className="text-stone-700 text-2xl md:text-3xl font-bold font-sans">100%</div>
              <div className="text-stone-500 text-xs md:text-sm font-bold font-sans uppercase tracking-wider">
                Minh Bạch
              </div>
            </div>
            <div className="flex flex-col justify-start items-start gap-1 md:gap-2">
              <div className="text-stone-700 text-2xl md:text-3xl font-bold font-sans">
                Real-time
              </div>
              <div className="text-stone-500 text-xs md:text-sm font-bold font-sans uppercase tracking-wider">
                Theo dõi
              </div>
            </div>
            <div className="flex flex-col justify-start items-start gap-1 md:gap-2">
              <div className="text-stone-700 text-2xl md:text-3xl font-bold font-sans">Global</div>
              <div className="text-stone-500 text-xs md:text-sm font-bold font-sans uppercase tracking-wider">
                Tiêu chuẩn
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Graphic */}
        <div className="relative z-10 w-full md:w-auto flex flex-col items-center justify-center gap-6 group">
          <div className="relative w-64 h-64 p-6 bg-white rounded-xl shadow-2xl rotate-3 group-hover:rotate-0 transition-transform duration-500 flex flex-col justify-center items-center">
            <div
              className="w-full h-full relative"
              style={{
                backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, #f3f4f6 10px, #f3f4f6 20px)`,
              }}
            >
              {/* Simulated QR Code visual */}
              <div className="absolute inset-4 border-4 border-stone-900 rounded-xl relative flex justify-center items-center bg-white p-4">
                <QrCode className="w-full h-full text-stone-900" />
                <div className="absolute inset-0 bg-green-500/20 top-1/2 -mt-2 h-4 w-full animate-pulse shadow-[0_0_15px_rgba(34,197,94,0.5)] flex items-center justify-center">
                  <ScanLine className="w-full h-full text-green-600 opacity-80" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
