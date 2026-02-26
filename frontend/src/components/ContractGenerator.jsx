import React, { useState, useRef } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Textarea,
  Divider,
  Card,
  CardBody,
  CardHeader,
} from '@heroui/react';
import { 
  FileText, 
  Download, 
  Printer, 
  Calendar,
  User,
  Car as CarIcon,
  MapPin,
  Phone,
  Mail
} from 'lucide-react';
// import html2canvas from 'html2canvas';
// import jsPDF from 'jspdf';
import { numberToWords, formatCurrencyWithWords } from '../utils/numberToWords';

// Компонент для генерации договора купли-продажи
export default function ContractGenerator({ isOpen, onClose, car, onGenerate }) {
  const contractRef = useRef(null);
  const [buyerInfo, setBuyerInfo] = useState({
    fullName: '',
    passportSeries: '',
    passportNumber: '',
    passportIssued: '',
    passportDate: '',
    address: '',
    phone: '',
    email: ''
  });

  const [contractDate, setContractDate] = useState(
    new Date().toISOString().split('T')[0]
  );

  const handleInputChange = (field, value) => {
    setBuyerInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const generatePDF = async () => {
    try {
      const contractContent = generateContractContent();
      const contractDate = new Date().toLocaleDateString('ru-RU');
      const fileName = `Договор_${car.brand}_${car.model}_${contractDate}.html`;
      
      // Создаем HTML контент
      const htmlContent = `
        <html>
          <head>
            <title>Договор купли-продажи ${car.brand} ${car.model}</title>
            <meta charset="UTF-8">
            <style>
              @page { margin: 2cm; }
              body { 
                font-family: 'Times New Roman', serif; 
                font-size: 14px; 
                line-height: 1.6; 
                margin: 0; 
                padding: 20px;
                color: #000;
              }
              .header { 
                text-align: center; 
                font-weight: bold; 
                font-size: 16px;
                margin-bottom: 30px; 
              }
              .content {
                white-space: pre-wrap;
                text-align: justify;
              }
              table { border-collapse: collapse; }
              td { border: 1px solid #000; padding: 5px; }
              @media print {
                body { margin: 0; }
              }
            </style>
          </head>
          <body>
            <div class="content">${contractContent}</div>
          </body>
        </html>
      `;

      // Создаем Blob и скачиваем файл
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      if (onGenerate) {
        onGenerate();
      }
    } catch (error) {
      console.error('Ошибка при генерации PDF:', error);
    }
  };

  const generateContractContent = () => {
    const currentDate = new Date(contractDate).toLocaleDateString('ru-RU');
    const priceInWords = car.sellingPrice ? numberToWords(car.sellingPrice) : '';
    
    return `<div class="header">ДОГОВОР КУПЛИ-ПРОДАЖИ АВТОМОБИЛЯ № ____</div>

<div style="text-align: right; margin-bottom: 20px;">г. Бишкек&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${currentDate}</div>

<p>&nbsp;&nbsp;&nbsp;&nbsp;ООО "AutoKorea", именуемое в дальнейшем <strong>"ПРОДАВЕЦ"</strong>, в лице директора, действующего на основании Устава, с одной стороны, и гражданин(ка) <strong>${buyerInfo.fullName || '_______________________'}</strong>, именуемый(ая) в дальнейшем <strong>"ПОКУПАТЕЛЬ"</strong>, с другой стороны, заключили настоящий договор о нижеследующем:</p>

<h3>1. ПРЕДМЕТ ДОГОВОРА</h3>

<p><strong>1.1.</strong> ПРОДАВЕЦ обязуется передать в собственность ПОКУПАТЕЛЮ, а ПОКУПАТЕЛЬ обязуется принять и оплатить следующее транспортное средство:</p>

<table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
  <tr>
    <td style="padding: 5px; border: 1px solid #000;"><strong>Марка:</strong></td>
    <td style="padding: 5px; border: 1px solid #000;">${car.brand}</td>
  </tr>
  <tr>
    <td style="padding: 5px; border: 1px solid #000;"><strong>Модель:</strong></td>
    <td style="padding: 5px; border: 1px solid #000;">${car.model}</td>
  </tr>
  <tr>
    <td style="padding: 5px; border: 1px solid #000;"><strong>Год выпуска:</strong></td>
    <td style="padding: 5px; border: 1px solid #000;">${car.year}</td>
  </tr>
  <tr>
    <td style="padding: 5px; border: 1px solid #000;"><strong>Идентификационный номер (VIN):</strong></td>
    <td style="padding: 5px; border: 1px solid #000;">${car.vin}</td>
  </tr>
  <tr>
    <td style="padding: 5px; border: 1px solid #000;"><strong>Цвет:</strong></td>
    <td style="padding: 5px; border: 1px solid #000;">${car.color}</td>
  </tr>
  <tr>
    <td style="padding: 5px; border: 1px solid #000;"><strong>Пробег:</strong></td>
    <td style="padding: 5px; border: 1px solid #000;">${car.mileage?.toLocaleString() || 'Не указан'} км</td>
  </tr>
  <tr>
    <td style="padding: 5px; border: 1px solid #000;"><strong>Объем двигателя:</strong></td>
    <td style="padding: 5px; border: 1px solid #000;">${car.engineVolume || 'Не указан'}</td>
  </tr>
  <tr>
    <td style="padding: 5px; border: 1px solid #000;"><strong>Тип топлива:</strong></td>
    <td style="padding: 5px; border: 1px solid #000;">${car.fuel || 'Не указан'}</td>
  </tr>
  <tr>
    <td style="padding: 5px; border: 1px solid #000;"><strong>Тип трансмиссии:</strong></td>
    <td style="padding: 5px; border: 1px solid #000;">${car.transmission || 'Не указан'}</td>
  </tr>
</table>

<p><strong>1.2.</strong> Транспортное средство передается со всеми принадлежностями и документами.</p>

<h3>2. ЦЕНА ДОГОВОРА И ПОРЯДОК РАСЧЕТОВ</h3>

<p><strong>2.1.</strong> Стоимость транспортного средства составляет <strong>$${car.sellingPrice ? car.sellingPrice.toLocaleString() : '_______'}</strong> ${priceInWords ? `(${priceInWords} долларов США)` : '(_________________________________ долларов США)'}.</p>

<p><strong>2.2.</strong> Расчеты производятся наличными денежными средствами в момент подписания настоящего договора и передачи транспортного средства.</p>

<h3>3. ПРАВА И ОБЯЗАННОСТИ СТОРОН</h3>

<p><strong>3.1.</strong> ПРОДАВЕЦ обязуется:</p>
<p>- Передать ПОКУПАТЕЛЮ транспортное средство, соответствующее условиям настоящего договора;<br>
- Передать документы на транспортное средство;<br>
- Передать ключи от транспортного средства.</p>

<p><strong>3.2.</strong> ПОКУПАТЕЛЬ обязуется:</p>
<p>- Принять транспортное средство;<br>
- Уплатить стоимость транспортного средства в сроки, установленные настоящим договором;<br>
- Произвести перерегистрацию транспортного средства в установленном порядке.</p>

<h3>4. ПЕРЕХОД ПРАВА СОБСТВЕННОСТИ</h3>

<p><strong>4.1.</strong> Право собственности на транспортное средство переходит к ПОКУПАТЕЛЮ с момента подписания настоящего договора и передачи денежных средств.</p>

<p><strong>4.2.</strong> Риск случайной гибели или порчи транспортного средства переходит к ПОКУПАТЕЛЮ одновременно с переходом права собственности.</p>

<h3>5. ЗАКЛЮЧИТЕЛЬНЫЕ ПОЛОЖЕНИЯ</h3>

<p><strong>5.1.</strong> Настоящий договор вступает в силу с момента его подписания и действует до полного исполнения сторонами принятых на себя обязательств.</p>

<p><strong>5.2.</strong> Споры, возникающие при исполнении настоящего договора, разрешаются путем переговоров, а при недостижении соглашения - в судебном порядке в соответствии с действующим законодательством Кыргызской Республики.</p>

<p><strong>5.3.</strong> Настоящий договор составлен в двух экземплярах, имеющих одинаковую юридическую силу, по одному для каждой из сторон.</p>

<h3>6. РЕКВИЗИТЫ И ПОДПИСИ СТОРОН</h3>

<table style="width: 100%; margin-top: 30px;">
  <tr>
    <td style="width: 50%; vertical-align: top; padding-right: 20px;">
      <p><strong>ПРОДАВЕЦ:</strong><br>
      ООО "AutoKorea"<br>
      Адрес: г. Бишкек, __________________<br>
      Тел.: _____________________________<br><br><br>
      _______________/__________/<br>
      &nbsp;&nbsp;&nbsp;(подпись)&nbsp;&nbsp;&nbsp;(Ф.И.О.)<br><br>
      М.П.</p>
    </td>
    <td style="width: 50%; vertical-align: top;">
      <p><strong>ПОКУПАТЕЛЬ:</strong><br>
      ${buyerInfo.fullName || '_______________________'}<br>
      Паспорт: ${buyerInfo.passportSeries || '__'} ${buyerInfo.passportNumber || '______'}<br>
      Выдан: ${buyerInfo.passportIssued || '_________________'}<br>
      Дата выдачи: ${buyerInfo.passportDate ? new Date(buyerInfo.passportDate).toLocaleDateString('ru-RU') : '__________'}<br>
      Адрес: ${buyerInfo.address || '_________________'}<br>
      Тел.: ${buyerInfo.phone || '_________________'}<br><br>
      _______________/__________/<br>
      &nbsp;&nbsp;&nbsp;(подпись)&nbsp;&nbsp;&nbsp;(Ф.И.О.)</p>
    </td>
  </tr>
</table>

<div style="margin-top: 40px;">
  <p>Транспортное средство получил(а): _______________/__________/<br>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(подпись)&nbsp;&nbsp;&nbsp;(Ф.И.О.)</p>
  
  <p>Денежные средства получил: _______________/__________/<br>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(подпись)&nbsp;&nbsp;&nbsp;(Ф.И.О.)</p>
</div>`;
  };

  const handlePrint = () => {
    // Создаем новое окно для печати
    const printWindow = window.open('', '_blank');
    const contractContent = generateContractContent();
    
    printWindow.document.write(`
      <html>
        <head>
          <title>Договор купли-продажи</title>
          <meta charset="UTF-8">
          <style>
            @page { margin: 2cm; }
            body { 
              font-family: 'Times New Roman', serif; 
              font-size: 14px; 
              line-height: 1.6; 
              margin: 0; 
              padding: 20px;
              color: #000;
            }
            .header { 
              text-align: center; 
              font-weight: bold; 
              font-size: 16px;
              margin-bottom: 30px; 
            }
            table { border-collapse: collapse; }
            td { border: 1px solid #000; padding: 5px; }
            @media print {
              body { margin: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="no-print" style="margin-bottom: 20px; text-align: center;">
            <button onclick="window.print()" style="padding: 10px 20px; font-size: 16px;">Печать</button>
            <button onclick="window.close()" style="padding: 10px 20px; font-size: 16px; margin-left: 10px;">Закрыть</button>
          </div>
          ${contractContent}
        </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      size="5xl"
      scrollBehavior="inside"
      classNames={{
        base: "rounded-2xl",
        wrapper: "rounded-2xl",
        backdrop: "bg-overlay/50 backdrop-opacity-disabled"
      }}
    >
      <ModalContent className="rounded-2xl">
        <ModalHeader className="flex flex-col gap-1 pb-2">
          <div className="flex items-center gap-2">
            <FileText className="text-primary" size={20} />
            <h3 className="text-lg font-semibold">Генерация договора купли-продажи</h3>
          </div>
          <p className="text-sm text-default-500 font-normal">
            {car.brand} {car.model} - {car.vin}
          </p>
        </ModalHeader>
        
        <ModalBody className="gap-4">
          {/* Информация об автомобиле */}
          <Card className="border border-default-200">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <CarIcon size={16} className="text-primary" />
                <h4 className="font-semibold">Информация об автомобиле</h4>
              </div>
            </CardHeader>
            <CardBody className="pt-2">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-default-500">Марка и модель</p>
                  <p className="font-medium">{car.brand} {car.model}</p>
                </div>
                <div>
                  <p className="text-default-500">Год выпуска</p>
                  <p className="font-medium">{car.year}</p>
                </div>
                <div>
                  <p className="text-default-500">VIN</p>
                  <p className="font-medium font-mono text-xs">{car.vin}</p>
                </div>
                <div>
                  <p className="text-default-500">Пробег</p>
                  <p className="font-medium">{car.mileage?.toLocaleString()} км</p>
                </div>
                <div>
                  <p className="text-default-500">Цена</p>
                  <p className="font-medium text-success text-lg">
                    {car.sellingPrice ? `$${car.sellingPrice.toLocaleString()}` : 'Не указана'}
                  </p>
                </div>
                <div>
                  <p className="text-default-500">Цвет</p>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-4 h-4 rounded-full border border-default-300"
                      style={{ backgroundColor: car.color }}
                    />
                    <p className="font-medium">{car.color}</p>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Дата договора */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              type="date"
              label="Дата договора"
              value={contractDate}
              onChange={(e) => setContractDate(e.target.value)}
              startContent={<Calendar size={16} />}
              classNames={{ inputWrapper: "rounded-lg" }}
            />
          </div>

          {/* Информация о покупателе */}
          <Card className="border border-default-200">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <User size={16} className="text-primary" />
                <h4 className="font-semibold">Информация о покупателе</h4>
              </div>
            </CardHeader>
            <CardBody className="pt-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Полное имя"
                  placeholder="Иванов Иван Иванович"
                  value={buyerInfo.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  classNames={{ inputWrapper: "rounded-lg" }}
                  isRequired
                />
                
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    label="№ Документа"
                    placeholder="ID"
                    value={buyerInfo.passportSeries}
                    onChange={(e) => handleInputChange('passportSeries', e.target.value)}
                    classNames={{ inputWrapper: "rounded-lg" }}
                    maxLength={2}
                  />
                  <Input
                    label="Персональный номер"
                    placeholder="1234567"
                    value={buyerInfo.passportNumber}
                    onChange={(e) => handleInputChange('passportNumber', e.target.value)}
                    classNames={{ inputWrapper: "rounded-lg" }}
                  />
                </div>

                <Input
                  label="Кем выдан"
                  placeholder="МВД Кыргызской Республики"
                  value={buyerInfo.passportIssued}
                  onChange={(e) => handleInputChange('passportIssued', e.target.value)}
                  classNames={{ inputWrapper: "rounded-lg" }}
                />

                <Input
                  type="date"
                  label="Дата выдачи"
                  value={buyerInfo.passportDate}
                  onChange={(e) => handleInputChange('passportDate', e.target.value)}
                  classNames={{ inputWrapper: "rounded-lg" }}
                />

                <Textarea
                  label="Адрес регистрации"
                  placeholder="г. Бишкек, ул. ..."
                  value={buyerInfo.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  classNames={{ inputWrapper: "rounded-lg" }}
                  minRows={2}
                />

                <div className="space-y-4">
                  <Input
                    label="Телефон"
                    placeholder="+996 *** *** ***"
                    value={buyerInfo.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    startContent={<Phone size={16} />}
                    classNames={{ inputWrapper: "rounded-lg" }}
                  />
                  
                  <Input
                    label="Email (опционально)"
                    placeholder="example@mail.com"
                    value={buyerInfo.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    startContent={<Mail size={16} />}
                    classNames={{ inputWrapper: "rounded-lg" }}
                  />
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Предварительный просмотр */}
          <Card className="border border-default-200">
            <CardHeader className="pb-2">
              <h4 className="font-semibold">Предварительный просмотр</h4>
            </CardHeader>
            <CardBody className="pt-2">
              <div 
                ref={contractRef}
                className="p-4 border border-default-200 rounded-lg bg-white text-black max-h-96 overflow-y-auto"
                style={{ fontSize: '12px', lineHeight: '1.4' }}
                dangerouslySetInnerHTML={{ __html: generateContractContent() }}
              />
            </CardBody>
          </Card>
        </ModalBody>

        <ModalFooter className="gap-2">
          <Button
            variant="bordered"
            onPress={onClose}
            className="rounded-lg"
          >
            Отмена
          </Button>
          
          <Button
            variant="bordered"
            startContent={<Printer size={16} />}
            onPress={handlePrint}
            className="rounded-lg"
            isDisabled={!buyerInfo.fullName}
          >
            Печать
          </Button>
          
          <Button
            color="primary"
            startContent={<Download size={16} />}
            onPress={generatePDF}
            className="rounded-lg"
            isDisabled={!buyerInfo.fullName}
          >
            Скачать PDF
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}