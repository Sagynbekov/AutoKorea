import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Input,
  Accordion,
  AccordionItem,
  Divider,
} from '@heroui/react';
import {
  HelpCircle,
  Book,
  MessageCircle,
  Phone,
  Mail,
  ExternalLink,
  Search,
  FileText,
  Video,
  Users,
} from 'lucide-react';

const faqItems = [
  {
    question: 'Как добавить новый автомобиль в систему?',
    answer: 'Перейдите в раздел "Автомобили" и нажмите кнопку "Добавить авто". Заполните все необходимые поля: VIN, марку, модель, год выпуска и другие характеристики. После сохранения автомобиль появится в общем списке.',
  },
  {
    question: 'Как работает калькулятор стоимости?',
    answer: 'Калькулятор помогает рассчитать полную стоимость автомобиля из Кореи. Введите цену на аукционе, выберите тип доставки, укажите характеристики двигателя. Система автоматически рассчитает таможенные пошлины, НДС и рекомендуемую цену продажи.',
  },
  {
    question: 'Как отслеживать статус доставки?',
    answer: 'В карточке каждого автомобиля есть раздел "Статус доставки" с визуальным прогресс-баром. Статусы обновляются автоматически при изменении этапа: заказан → на аукционе → выкуплен → в пути → растаможка → на складе.',
  },
  {
    question: 'Можно ли экспортировать данные?',
    answer: 'Да, в разделах "Автомобили", "Клиенты" и "Финансы" есть кнопка "Экспорт". Вы можете выгрузить данные в форматах PDF и Excel для отчетности или работы вне системы.',
  },
  {
    question: 'Как добавить нового клиента?',
    answer: 'Перейдите в раздел "Клиенты" и нажмите "Добавить клиента". Заполните контактные данные: имя, телефон, email, город. Клиента можно связать с конкретным автомобилем в карточке авто.',
  },
  {
    question: 'Как формируются отчеты?',
    answer: 'В разделе "Отчеты" выберите тип отчета (продажи, склад, финансы, клиенты) и период. Система автоматически сформирует документ с графиками и таблицами, который можно скачать или распечатать.',
  },
];

const guides = [
  {
    title: 'Начало работы',
    description: 'Базовое руководство по работе с системой',
    icon: Book,
  },
  {
    title: 'Видео-уроки',
    description: 'Обучающие видео по основным функциям',
    icon: Video,
  },
  {
    title: 'Документация API',
    description: 'Техническая документация для разработчиков',
    icon: FileText,
  },
];

export default function Help() {
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">Центр помощи</h1>
        <p className="text-default-500">Найдите ответы на свои вопросы или свяжитесь с поддержкой</p>
      </div>

      {/* Search */}
      <div className="max-w-xl mx-auto">
        <Input
          size="lg"
          placeholder="Поиск по базе знаний..."
          startContent={<Search size={20} className="text-default-400" />}
        />
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {guides.map((guide) => {
          const Icon = guide.icon;
          return (
            <Card key={guide.title} isPressable className="border border-default-200 hover:border-primary">
              <CardBody className="p-5 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Icon size={24} className="text-primary" />
                </div>
                <h3 className="font-semibold mb-1">{guide.title}</h3>
                <p className="text-sm text-default-500">{guide.description}</p>
              </CardBody>
            </Card>
          );
        })}
      </div>

      {/* FAQ */}
      <Card className="border border-default-200">
        <CardHeader>
          <div className="flex items-center gap-2">
            <HelpCircle size={20} className="text-primary" />
            <h2 className="font-semibold">Часто задаваемые вопросы</h2>
          </div>
        </CardHeader>
        <CardBody>
          <Accordion variant="splitted">
            {faqItems.map((item, index) => (
              <AccordionItem
                key={index}
                aria-label={item.question}
                title={item.question}
                classNames={{
                  title: "text-sm font-medium",
                  content: "text-sm text-default-600",
                }}
              >
                {item.answer}
              </AccordionItem>
            ))}
          </Accordion>
        </CardBody>
      </Card>

      {/* Contact Support */}
      <Card className="border border-default-200">
        <CardHeader>
          <div className="flex items-center gap-2">
            <MessageCircle size={20} className="text-primary" />
            <h2 className="font-semibold">Связаться с поддержкой</h2>
          </div>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-default-50 rounded-lg text-center">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Phone size={20} className="text-primary" />
              </div>
              <p className="font-medium mb-1">Телефон</p>
              <p className="text-sm text-default-500">+7 (800) 123-45-67</p>
              <p className="text-xs text-default-400 mt-1">Пн-Пт 9:00-18:00</p>
            </div>
            <div className="p-4 bg-default-50 rounded-lg text-center">
              <div className="w-10 h-10 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Mail size={20} className="text-success" />
              </div>
              <p className="font-medium mb-1">Email</p>
              <p className="text-sm text-default-500">support@autokorea.com</p>
              <p className="text-xs text-default-400 mt-1">Ответ в течение 24ч</p>
            </div>
            <div className="p-4 bg-default-50 rounded-lg text-center">
              <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <MessageCircle size={20} className="text-secondary" />
              </div>
              <p className="font-medium mb-1">Онлайн-чат</p>
              <p className="text-sm text-default-500">Telegram: @autokorea</p>
              <p className="text-xs text-default-400 mt-1">Быстрые ответы</p>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Version Info */}
      <div className="text-center text-sm text-default-400">
        <p>AutoKorea CRM v1.0.0</p>
        <p>© 2026 AutoKorea. Все права защищены.</p>
      </div>
    </div>
  );
}
