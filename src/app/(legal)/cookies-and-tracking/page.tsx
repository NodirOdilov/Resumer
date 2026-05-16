import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Политика использования cookie и отслеживания | Resumer",
  description: "Узнайте о cookie и технологиях отслеживания, которые использует Resumer, почему мы их применяем и как управлять своими настройками.",
};

export default function CookiesPage() {
  return (
    <div className="bg-white">
      <section className="border-b border-gray-100 bg-gradient-to-b from-gray-50 to-white py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <nav className="mb-6 flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-[#0D47A1]">Главная</Link>
            <span>/</span>
            <span className="text-gray-900">Cookie и отслеживание</span>
          </nav>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">Политика использования cookie и отслеживания</h1>
          <p className="mt-3 text-sm text-gray-500">Последнее обновление: 1 марта 2026 г.</p>
        </div>
      </section>

      <article className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="prose prose-gray max-w-none prose-headings:text-gray-900 prose-h2:text-xl prose-h2:font-bold prose-h2:mt-8 prose-h2:mb-3 prose-p:text-gray-600 prose-p:leading-relaxed prose-li:text-gray-600">
          <h2>Что такое cookie?</h2>
          <p>Cookie — это небольшие текстовые файлы, сохраняемые на вашем устройстве при посещении сайта. Они помогают нам запоминать ваши предпочтения, понимать, как вы используете наш сервис, и улучшать ваш опыт.</p>

          <h2>Типы используемых нами cookie</h2>
          <ul>
            <li><strong>Необходимые cookie:</strong> требуются для работы сайта. Они отвечают за аутентификацию, безопасность и управление сессиями. Не могут быть отключены.</li>
            <li><strong>Функциональные cookie:</strong> запоминают ваши предпочтения, такие как язык, тема и параметры интерфейса, чтобы обеспечить персонализированный опыт.</li>
            <li><strong>Аналитические cookie:</strong> помогают нам понять, как посетители взаимодействуют с нашим сайтом, через агрегированные обезличенные данные. Мы используем их для улучшения сервиса.</li>
            <li><strong>Маркетинговые cookie:</strong> используются для показа релевантной рекламы и оценки эффективности наших маркетинговых кампаний.</li>
          </ul>

          <h2>Сторонние cookie</h2>
          <p>Мы используем следующие сторонние сервисы, которые могут устанавливать cookie:</p>
          <ul>
            <li><strong>Google Analytics:</strong> аналитика использования сайта (аналитические cookie)</li>
            <li><strong>Stripe:</strong> обработка платежей (необходимые cookie)</li>
            <li><strong>Intercom:</strong> чат поддержки клиентов (функциональные cookie)</li>
          </ul>

          <h2>Управление cookie</h2>
          <p>Вы можете управлять своими настройками cookie следующими способами:</p>
          <ul>
            <li><strong>Настройки браузера:</strong> большинство браузеров позволяют блокировать или удалять cookie через меню настроек.</li>
            <li><strong>Cookie-баннер:</strong> воспользуйтесь центром предпочтений cookie, который появляется при первом посещении нашего сайта.</li>
            <li><strong>Ссылки для отказа:</strong> многие сторонние сервисы предоставляют собственные механизмы отказа.</li>
          </ul>
          <p>Обратите внимание, что отключение определённых cookie может повлиять на функциональность нашего сервиса.</p>

          <h2>Do Not Track</h2>
          <p>Мы уважаем сигналы Do Not Track (DNT) браузеров. Когда DNT включён, мы ограничиваем отслеживание только необходимыми cookie.</p>

          <h2>Обновления</h2>
          <p>Мы можем периодически обновлять данную политику. Изменения будут отражены на этой странице с обновлённой датой ревизии.</p>

          <h2>Контакты</h2>
          <p>Вопросы о наших практиках использования cookie? Напишите нам на privacy@resumer.com.</p>
        </div>
      </article>
    </div>
  );
}
