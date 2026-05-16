import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Предупреждение о мошенничестве | Resumer",
  description: "Защитите себя от мошеннических схем с трудоустройством и поддельных сайтов. Узнайте, как распознать официальные сообщения Resumer и сообщать о самозванцах.",
};

export default function FraudAwarenessPage() {
  return (
    <div className="bg-white">
      <section className="border-b border-gray-100 bg-gradient-to-b from-gray-50 to-white py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <nav className="mb-6 flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-[#0D47A1]">Главная</Link>
            <span>/</span>
            <span className="text-gray-900">Предупреждение о мошенничестве</span>
          </nav>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">Предупреждение о мошенничестве</h1>
          <p className="mt-4 text-lg text-gray-600">Защита наших пользователей от мошенничества и обмана — наш главный приоритет.</p>
        </div>
      </section>

      <article className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="prose prose-gray max-w-none prose-headings:text-gray-900 prose-h2:text-xl prose-h2:font-bold prose-h2:mt-8 prose-h2:mb-3 prose-p:text-gray-600 prose-p:leading-relaxed prose-li:text-gray-600">
          <div className="rounded-xl bg-amber-50 border border-amber-200 p-6 not-prose mb-8">
            <div className="flex gap-3">
              <svg className="h-6 w-6 shrink-0 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <h3 className="font-semibold text-amber-900">Важное уведомление</h3>
                <p className="mt-1 text-sm text-amber-700">Resumer никогда не запрашивает у вас номер социального страхования, банковские реквизиты или оплату за трудоустройство. Мы — инструмент для создания резюме, а не рекрутер или агентство по трудоустройству.</p>
              </div>
            </div>
          </div>

          <h2>Как распознать официальные сообщения Resumer</h2>
          <ul>
            <li>Наш официальный сайт — <strong>resumer.com</strong> (с HTTPS)</li>
            <li>Официальные письма приходят только с домена <strong>@resumer.com</strong></li>
            <li>Мы никогда не отправляем нежданные предложения о работе или гарантии трудоустройства</li>
            <li>Мы никогда не запрашиваем конфиденциальную личную информацию по электронной почте</li>
            <li>Обработка платежей осуществляется безопасно через Stripe</li>
          </ul>

          <h2>Распространённые схемы мошенничества</h2>
          <ul>
            <li><strong>Поддельные сервисы проверки резюме:</strong> Нежданные письма с предложением проверить ваше резюме за плату якобы от имени Resumer.</li>
            <li><strong>Фишинговые сайты:</strong> Сайты, похожие на Resumer, но с немного отличающимися URL (например, resurner.com, resumer-pro.com).</li>
            <li><strong>Гарантии трудоустройства:</strong> Любые утверждения о том, что использование Resumer гарантирует работу или собеседования.</li>
            <li><strong>Платёжное мошенничество:</strong> Запросы на оплату вне нашего официального сайта или необычными способами, такими как банковский перевод или криптовалюта.</li>
            <li><strong>Имперсонация:</strong> Люди, выдающие себя за представителей Resumer в соцсетях или мессенджерах с целью получения личной информации.</li>
          </ul>

          <h2>Как защитить себя</h2>
          <ul>
            <li>Всегда заходите на Resumer, набирая resumer.com напрямую в браузере</li>
            <li>Проверяйте, что URL отображает HTTPS с действительным сертификатом безопасности</li>
            <li>Никогда не сообщайте никому свой пароль или учётные данные</li>
            <li>Скептически относитесь к нежданным письмам о вашем резюме или предложениях работы</li>
            <li>Используйте уникальный, надёжный пароль для своего аккаунта Resumer</li>
            <li>Включите двухфакторную аутентификацию, если она доступна</li>
          </ul>

          <h2>Сообщить о подозрительной активности</h2>
          <p>Если вы столкнулись с сайтом, письмом или человеком, выдающим себя за Resumer, пожалуйста, немедленно сообщите об этом:</p>
          <ul>
            <li>Email: security@resumer.com</li>
            <li>Приложите скриншоты и URL подозрительного контента</li>
            <li>Пересылайте фишинговые письма как вложения, а не в теле сообщения</li>
          </ul>
          <p>Мы расследуем все сообщения и сотрудничаем с правоохранительными органами и хостинг-провайдерами для блокировки мошеннических сайтов.</p>
        </div>
      </article>
    </div>
  );
}
