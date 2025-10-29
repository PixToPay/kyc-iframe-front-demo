import { motion } from "framer-motion";

export function Hero({ onStart }: { onStart: () => void }) {
  return (
    <section
      id="hero"
      className="min-h-screen flex items-center bg-gradient-to-br from-[color:var(--brand-dark)] via-[color:var(--brand-dark)] to-[color:var(--brand-primary)] relative overflow-hidden pt-20"
    >
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[color:var(--brand-primary)]/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
      </div>
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4">
        <div className="grid lg:grid-cols-5 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-3 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-6 leading-tight">
                Veja como o KYC da PixtoPay pode ser integrado ao seu sistema em
                minutos.
              </h1>
            </motion.div>

            <motion.p
              className="text-base md:text-lg lg:text-xl text-white/90 max-w-2xl mx-auto lg:mx-0 mb-10 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              Demonstração interativa de verificação de identidade via iframe —
              com reconhecimento facial, documentos e compliance automatizados.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <button
                onClick={onStart}
                className="bg-white text-[color:var(--brand-dark)] px-6 md:px-10 py-3 md:py-4 rounded-xl font-semibold text-base md:text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105"
              >
                Iniciar Demonstração
              </button>
            </motion.div>
          </div>

          <motion.div
            className="lg:col-span-2 flex justify-center mt-8 lg:mt-0"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <div className="relative w-56 md:w-64 h-[480px] md:h-[520px] bg-black rounded-[32px] md:rounded-[36px] shadow-2xl overflow-hidden border-6 md:border-8 border-gray-800">
              <img
                src="/assets/images/mock-kyc-mobile.png"
                className="w-full h-full object-contain"
                alt="KYC Mobile App"
              />
              <div className="absolute bottom-2 md:bottom-3 left-1/2 -translate-x-1/2 w-20 md:w-24 h-1 md:h-1.5 bg-gray-600 rounded-full"></div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
