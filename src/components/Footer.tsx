export function Footer() {
  return (
    <footer className="bg-gradient-to-t from-[color:var(--brand-dark)] to-[color:var(--brand-dark)]/95 text-gray-300 py-12 relative">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img
                src="/assets/logos/pixtopay_dark_bg.svg"
                className="h-8"
                alt="PixtoPay"
              />
              <div className="w-px h-6 bg-white/60"></div>
              <img src="/assets/logos/kyc.svg" className="h-8" alt="KYC" />
            </div>
            <p className="text-sm text-gray-400 mb-4">
              Solução completa de verificação de identidade para fintechs e
              empresas.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Desenvolvedores</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-white transition">
                  Documentação
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  SDKs
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Exemplos
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Suporte</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="mailto:suporte@pixtopay.com"
                  className="hover:text-white transition"
                >
                  suporte@pixtopay.com
                </a>
              </li>
              <li>
                <a
                  href="https://backoffice.pixtopay.com.br/plataforma/"
                  target="_blank"
                  className="hover:text-white transition"
                >
                  Dashboard
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-6 text-center">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} PixtoPay. Todos os direitos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
