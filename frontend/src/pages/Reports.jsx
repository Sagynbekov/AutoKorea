import { useState, useEffect } from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Divider,
  Select,
  SelectItem,
  Spinner,
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
  formatCurrency,
  formatDate,
  calculateProfit,
} from '../data/mockData';
import { useCars } from '../hooks/useCars';
import { useStaff } from '../hooks/useStaff';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

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

function ReportCard({ report, period, onDownloadPDF, onDownloadExcel }) {
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
              <Button 
                size="sm" 
                variant="flat" 
                color="primary" 
                startContent={<Download size={14} />}
                onPress={() => onDownloadPDF(report)}
              >
                PDF
              </Button>
              <Button 
                size="sm" 
                variant="flat" 
                startContent={<FileSpreadsheet size={14} />}
                onPress={() => onDownloadExcel(report)}
              >
                Excel
              </Button>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}







// Функция для транслитерации кириллицы в латиницу
const transliterate = (text) => {
  const map = {
    'А': 'A', 'Б': 'B', 'В': 'V', 'Г': 'G', 'Д': 'D', 'Е': 'E', 'Ё': 'Yo', 'Ж': 'Zh',
    'З': 'Z', 'И': 'I', 'Й': 'Y', 'К': 'K', 'Л': 'L', 'М': 'M', 'Н': 'N', 'О': 'O',
    'П': 'P', 'Р': 'R', 'С': 'S', 'Т': 'T', 'У': 'U', 'Ф': 'F', 'Х': 'Kh', 'Ц': 'Ts',
    'Ч': 'Ch', 'Ш': 'Sh', 'Щ': 'Sch', 'Ъ': '', 'Ы': 'Y', 'Ь': '', 'Э': 'E', 'Ю': 'Yu', 'Я': 'Ya',
    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo', 'ж': 'zh',
    'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o',
    'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'kh', 'ц': 'ts',
    'ч': 'ch', 'ш': 'sh', 'щ': 'sch', 'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya'
  };
  
  if (!text) return '';
  return text.split('').map(char => map[char] || char).join('');
};

export default function Reports() {
  const [period, setPeriod] = useState('month');
  const { cars, loading: carsLoading } = useCars();
  const { staff, loading: staffLoading } = useStaff();

  const periodLabels = {
    week: 'За неделю',
    month: 'За месяц',
    quarter: 'За квартал',
    year: 'За год'
  };
  
  const periodLabelsEn = {
    week: 'Weekly',
    month: 'Monthly',
    quarter: 'Quarterly',
    year: 'Yearly'
  };

  // Функция для получения данных в зависимости от типа отчета
  const getReportData = (reportId, forPDF = false) => {
    const currentDate = new Date().toLocaleDateString('ru-RU');
    
    switch(reportId) {
      case 'sales':
        // Используем реальные данные о проданных автомобилях
        const soldCars = cars.filter(car => car.status === 'sold');
        return {
          headers: forPDF 
            ? ['Date', 'Car', 'VIN', 'Purchase', 'Sale', 'Profit']
            : ['Дата', 'Автомобиль', 'VIN', 'Закупка', 'Продажа', 'Прибыль'],
          data: soldCars.map(car => {
            const profit = (car.sellingPrice || 0) - (car.purchasePrice || 0);
            const date = car.soldAt || car.createdAt;
            const formattedDate = date ? (forPDF ? new Date(date).toLocaleDateString('en-US') : formatDate(date)) : 'N/A';
            
            return [
              formattedDate,
              forPDF ? transliterate(`${car.brand} ${car.model}`) : `${car.brand} ${car.model}`,
              car.vin || 'N/A',
              formatCurrency(car.purchasePrice),
              formatCurrency(car.sellingPrice),
              formatCurrency(profit)
            ];
          })
        };
      
      case 'inventory':
        // Используем реальные данные о автомобилях в наличии
        const availableCars = cars.filter(car => car.status === 'available' || car.status === 'reserved');
        return {
          headers: forPDF
            ? ['Brand', 'Model', 'Year', 'VIN', 'Purchase Price', 'Selling Price', 'Status']
            : ['Марка', 'Модель', 'Год', 'VIN', 'Цена закупки', 'Цена продажи', 'Статус'],
          data: availableCars.map(car => [
            forPDF ? transliterate(car.brand) : car.brand,
            forPDF ? transliterate(car.model) : car.model,
            car.year,
            car.vin || 'N/A',
            formatCurrency(car.purchasePrice),
            formatCurrency(car.sellingPrice),
            forPDF 
              ? (car.status === 'available' ? 'Available' : 'Reserved')
              : (car.status === 'available' ? 'В наличии' : 'Зарезервирован')
          ])
        };
      
      case 'financial':
        // Рассчитываем финансовые показатели
        const totalPurchase = cars.reduce((sum, car) => sum + (car.purchasePrice || 0), 0);
        const totalSelling = cars.filter(car => car.status === 'sold')
          .reduce((sum, car) => sum + (car.sellingPrice || 0), 0);
        const totalProfit = totalSelling - cars.filter(car => car.status === 'sold')
          .reduce((sum, car) => sum + (car.purchasePrice || 0), 0);
        const profitMargin = totalSelling > 0 ? ((totalProfit / totalSelling) * 100).toFixed(1) : 0;

        // Группируем по статусу
        const byStatus = cars.reduce((acc, car) => {
          const status = car.status || 'unknown';
          if (!acc[status]) {
            acc[status] = { count: 0, purchase: 0, selling: 0 };
          }
          acc[status].count++;
          acc[status].purchase += car.purchasePrice || 0;
          acc[status].selling += car.sellingPrice || 0;
          return acc;
        }, {});

        const statusLabels = forPDF ? {
          available: 'Available',
          reserved: 'Reserved',
          sold: 'Sold',
          in_transit: 'In Transit'
        } : {
          available: 'В наличии',
          reserved: 'Зарезервирован',
          sold: 'Продан',
          in_transit: 'В пути'
        };

        return {
          headers: forPDF
            ? ['Status', 'Quantity', 'Purchased', 'Sold', 'Profit']
            : ['Статус', 'Количество', 'Закуплено на', 'Продано на', 'Прибыль'],
          data: Object.entries(byStatus).map(([status, data]) => [
            statusLabels[status] || status,
            data.count,
            formatCurrency(data.purchase),
            formatCurrency(data.selling),
            formatCurrency(data.selling - data.purchase)
          ]).concat([
            [forPDF ? 'TOTAL' : 'ИТОГО', cars.length, formatCurrency(totalPurchase), formatCurrency(totalSelling), formatCurrency(totalProfit)]
          ])
        };
      
      case 'clients':
        // Используем реальные данные о сотрудниках
        return {
          headers: forPDF
            ? ['Employee', 'Phone', 'Email', 'Passport', 'Address']
            : ['Сотрудник', 'Телефон', 'Email', 'Паспорт', 'Адрес'],
          data: staff.map(person => [
            forPDF ? transliterate(person.name || 'N/A') : (person.name || 'N/A'),
            person.phone || 'N/A',
            person.email || 'N/A',
            person.passportNumber || 'N/A',
            forPDF ? transliterate(person.address || 'N/A') : (person.address || 'N/A')
          ])
        };
      
      default:
        return { headers: [], data: [] };
    }
  };

  // Функция для генерации PDF с поддержкой UTF-8
  const handleDownloadPDF = (report) => {
    try {
      const doc = new jsPDF();
      const reportData = getReportData(report.id, true); // Передаем true для PDF
      const currentDate = new Date().toLocaleDateString('en-US');
      
      // Заголовок
      doc.setFontSize(16);
      doc.text(transliterate(report.title), 14, 20);
      
      doc.setFontSize(10);
      doc.text(`Period: ${periodLabelsEn[period]}`, 14, 30);
      doc.text(`Generated: ${currentDate}`, 14, 37);
      
      // Добавление таблицы с данными используя autoTable
      autoTable(doc, {
        head: [reportData.headers],
        body: reportData.data,
        startY: 45,
        styles: { 
          font: 'helvetica',
          fontSize: 8,
          cellPadding: 3,
        },
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: 255,
          fontStyle: 'bold',
          halign: 'center'
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245]
        },
        margin: { top: 45, left: 10, right: 10 }
      });
      
      // Сохранение файла
      doc.save(`${report.id}_report_${period}_${new Date().getTime()}.pdf`);
    } catch (error) {
      console.error('PDF generation error:', error);
      alert('Ошибка при генерации PDF. Проверьте консоль для деталей.');
    }
  };

  // Функция для генерации Excel
  const handleDownloadExcel = (report) => {
    const reportData = getReportData(report.id);
    const currentDate = new Date().toLocaleDateString('ru-RU');
    
    // Создание заголовка
    const wsData = [
      [report.title],
      [`Период: ${periodLabels[period]}`],
      [`Дата формирования: ${currentDate}`],
      [], // Пустая строка
      reportData.headers,
      ...reportData.data
    ];
    
    // Создание листа
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    
    // Настройка ширины колонок
    const colWidths = reportData.headers.map(() => ({ wch: 20 }));
    ws['!cols'] = colWidths;
    
    // Объединение ячеек для заголовка
    ws['!merges'] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: reportData.headers.length - 1 } }
    ];
    
    // Создание книги
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, report.title.substring(0, 31));
    
    // Сохранение файла
    XLSX.writeFile(wb, `${report.id}_report_${period}_${new Date().getTime()}.xlsx`);
  };

  const isLoading = carsLoading || staffLoading;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Отчеты</h1>
          <p className="text-default-500">Генерация и просмотр отчетов</p>
        </div>
        <div className="flex gap-2">
          <Select 
            size="sm" 
            className="w-40" 
            selectedKeys={[period]}
            onSelectionChange={(keys) => setPeriod(Array.from(keys)[0])}
          >
            <SelectItem key="week">За неделю</SelectItem>
            <SelectItem key="month">За месяц</SelectItem>
            <SelectItem key="quarter">За квартал</SelectItem>
            <SelectItem key="year">За год</SelectItem>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Spinner size="lg" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reportTypes.map((report) => (
            <ReportCard 
              key={report.id} 
              report={report} 
              period={period}
              onDownloadPDF={handleDownloadPDF}
              onDownloadExcel={handleDownloadExcel}
            />
          ))}
        </div>
      )}
    </div>
  );
}
