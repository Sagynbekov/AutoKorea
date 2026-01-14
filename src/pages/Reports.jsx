import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Divider,
  Select,
  SelectItem,
} from '@heroui/react';
import {
  FileText,
  Download,
  Calendar,
  TrendingUp,
  Car,
  DollarSign,
  Users,
  BarChart3,
  PieChart,
  FileSpreadsheet,
} from 'lucide-react';
import {
  dashboardStats,
  salesByMonth,
  popularBrands,
  formatCurrency,
} from '../data/mockData';

const reportTypes = [
  {
    id: 'sales',
    title: 'Отчет по продажам',
    description: 'Детальная информация о всех продажах за период',
    icon: TrendingUp,
    color: 'success',
  },
  {
    id: 'inventory',
    title: 'Отчет по складу',
    description: 'Текущее состояние склада и движение товаров',
    icon: Car,
    color: 'primary',
  },
  {
    id: 'financial',
    title: 'Финансовый отчет',
    description: 'Доходы, расходы и прибыль компании',
    icon: DollarSign,
    color: 'warning',
  },
  {
    id: 'clients',
    title: 'Отчет по клиентам',
    description: 'Анализ клиентской базы и активности',
    icon: Users,
    color: 'secondary',
  },
];

function ReportCard({ report }) {
  const Icon = report.icon;
  
  return (
    <Card className="border border-default-200 hover:border-primary transition-colors">
      <CardBody className="p-5">
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-xl bg-${report.color}/10`}>
            <Icon size={24} className={`text-${report.color}`} />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold mb-1">{report.title}</h3>
            <p className="text-sm text-default-500 mb-4">{report.description}</p>
            <div className="flex gap-2">
              <Button size="sm" variant="flat" color="primary" startContent={<Download size={14} />}>
                PDF
              </Button>
              <Button size="sm" variant="flat" startContent={<FileSpreadsheet size={14} />}>
                Excel
              </Button>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

function QuickStats() {
  return (
    <Card className="border border-default-200">
      <CardHeader>
        <h3 className="font-semibold">Краткая статистика</h3>
      </CardHeader>
      <CardBody className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-default-50 rounded-lg text-center">
            <p className="text-2xl font-bold text-success">{dashboardStats.carsSoldTotal}</p>
            <p className="text-sm text-default-500">Продано всего</p>
          </div>
          <div className="p-4 bg-default-50 rounded-lg text-center">
            <p className="text-2xl font-bold text-primary">{formatCurrency(dashboardStats.totalRevenue)}</p>
            <p className="text-sm text-default-500">Выручка</p>
          </div>
          <div className="p-4 bg-default-50 rounded-lg text-center">
            <p className="text-2xl font-bold text-warning">{dashboardStats.carsInTransit}</p>
            <p className="text-sm text-default-500">В пути</p>
          </div>
          <div className="p-4 bg-default-50 rounded-lg text-center">
            <p className="text-2xl font-bold text-secondary">{dashboardStats.totalClients}</p>
            <p className="text-sm text-default-500">Клиентов</p>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

function SalesOverview() {
  return (
    <Card className="border border-default-200">
      <CardHeader className="flex justify-between items-center">
        <h3 className="font-semibold">Продажи по месяцам</h3>
        <Select size="sm" className="w-32" defaultSelectedKeys={['2025']}>
          <SelectItem key="2025">2025</SelectItem>
          <SelectItem key="2026">2026</SelectItem>
        </Select>
      </CardHeader>
      <CardBody>
        <div className="space-y-3">
          {salesByMonth.map((month) => (
            <div key={month.month} className="flex items-center justify-between p-3 bg-default-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Calendar size={16} className="text-default-400" />
                <span className="font-medium">{month.month}</span>
              </div>
              <div className="text-right">
                <p className="font-semibold">{month.sales} авто</p>
                <p className="text-sm text-success">{formatCurrency(month.revenue)}</p>
              </div>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
}

function BrandStats() {
  return (
    <Card className="border border-default-200">
      <CardHeader>
        <h3 className="font-semibold">Продажи по маркам</h3>
      </CardHeader>
      <CardBody>
        <div className="space-y-4">
          {popularBrands.map((brand, index) => (
            <div key={brand.brand} className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                {index + 1}
              </div>
              <div className="flex-1">
                <div className="flex justify-between mb-1">
                  <span className="font-medium">{brand.brand}</span>
                  <span className="text-sm text-default-500">{brand.count} авто</span>
                </div>
                <div className="h-2 bg-default-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${brand.percentage}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
}

export default function Reports() {
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Отчеты</h1>
          <p className="text-default-500">Генерация и просмотр отчетов</p>
        </div>
        <div className="flex gap-2">
          <Select size="sm" className="w-40" defaultSelectedKeys={['month']}>
            <SelectItem key="week">За неделю</SelectItem>
            <SelectItem key="month">За месяц</SelectItem>
            <SelectItem key="quarter">За квартал</SelectItem>
            <SelectItem key="year">За год</SelectItem>
          </Select>
          <Button color="primary" startContent={<FileText size={16} />}>
            Создать отчет
          </Button>
        </div>
      </div>

      {/* Report Types */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reportTypes.map((report) => (
          <ReportCard key={report.id} report={report} />
        ))}
      </div>

      {/* Stats and Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <QuickStats />
        <SalesOverview />
        <BrandStats />
      </div>
    </div>
  );
}
