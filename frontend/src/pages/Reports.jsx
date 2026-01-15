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
    title: 'Отчет по сотрудникам',
    description: 'Анализ производительности и активности',
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
        </div>
      </div>

      {/* Report Types */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reportTypes.map((report) => (
          <ReportCard key={report.id} report={report} />
        ))}
      </div>
    </div>
  );
}
