import { useState, useMemo, useEffect } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Select,
  SelectItem,
  Textarea,
  Autocomplete,
  AutocompleteItem,
} from '@heroui/react';
import { Plus } from 'lucide-react';
import { useStaff } from '../hooks/useStaff';
import { carService } from '../services/carService';

/**
 * Универсальная модалка для добавления различных сущностей
 * @param {boolean} isOpen - Открыта ли модалка
 * @param {function} onClose - Функция закрытия модалки
 * @param {string} type - Тип модалки: 'car', 'client', 'order'
 * @param {function} onSubmit - Функция обработки отправки формы
 */
export default function AddModal({ isOpen, onClose, type, onSubmit }) {
  const { staff: clients, loading: clientsLoading } = useStaff();
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [carSearchValue, setCarSearchValue] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPhotos, setSelectedPhotos] = useState([]);

  // Вычисление себестоимости
  const totalCost = useMemo(() => {
    const purchase = parseFloat(formData.purchaseCost) || 0;
    const delivery = parseFloat(formData.deliveryCost) || 0;
    const customs = parseFloat(formData.customsCost) || 0;
    const repair = parseFloat(formData.repairCost) || 0;
    const other = parseFloat(formData.otherCost) || 0;
    return purchase + delivery + customs + repair + other;
  }, [formData.purchaseCost, formData.deliveryCost, formData.customsCost, formData.repairCost, formData.otherCost]);

  // Фильтрация сотрудников по ИНН и имени
  const filteredClients = useMemo(() => {
    if (!searchValue) return clients;
    
    const search = searchValue.toLowerCase();
    return clients.filter(client => 
      client.passportNumber?.toLowerCase().includes(search) ||
      client.name.toLowerCase().includes(search)
    );
  }, [searchValue, clients]);

  const handleInputChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Обработка выбора фотографий
  const handlePhotoSelect = (e) => {
    const files = Array.from(e.target.files);
    const newPhotos = files.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
    }));
    setSelectedPhotos(prev => [...prev, ...newPhotos]);
  };

  // Удаление фотографии
  const handlePhotoRemove = (photoId) => {
    setSelectedPhotos(prev => {
      const photo = prev.find(p => p.id === photoId);
      if (photo) {
        URL.revokeObjectURL(photo.preview);
      }
      return prev.filter(p => p.id !== photoId);
    });
  };

  // Очистка всех фото при размонтировании
  useEffect(() => {
    return () => {
      selectedPhotos.forEach(photo => {
        URL.revokeObjectURL(photo.preview);
      });
    };
  }, [selectedPhotos]);

  // Форматирование телефона с автоматическим +996
  const handlePhoneChange = (value) => {
    // Удаляем все нецифровые символы
    const digits = value.replace(/\D/g, '');
    
    // Берем только первые 9 цифр после кода страны
    const phoneDigits = digits.startsWith('996') ? digits.slice(3, 12) : digits.slice(0, 9);
    
    // Форматируем номер: +996 XXX XXX XXX
    let formatted = '+996';
    if (phoneDigits.length > 0) {
      formatted += ' ' + phoneDigits.slice(0, 3);
    }
    if (phoneDigits.length > 3) {
      formatted += ' ' + phoneDigits.slice(3, 6);
    }
    if (phoneDigits.length > 6) {
      formatted += ' ' + phoneDigits.slice(6, 9);
    }
    
    setFormData(prev => ({ ...prev, phone: formatted }));
  };

  // Ограничение ввода ИНН до 14 цифр
  const handlePassportChange = (value) => {
    // Удаляем все нецифровые символы и ограничиваем до 14 цифр
    const digits = value.replace(/\D/g, '').slice(0, 14);
    setFormData(prev => ({ ...prev, passportNumber: digits }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Для заказов: 3 шага (данные -> фото -> цены)
    // Для авто: 2 шага (данные -> цены)
    if (type === 'order' && currentStep < 3) {
      setCurrentStep(prev => prev + 1);
      return;
    }
    
    if (type === 'car' && currentStep === 1) {
      setCurrentStep(2);
      return;
    }
    
    setIsLoading(true);
    
    try {
      if (type === 'order') {
        // Находим выбранного клиента по passportNumber
        const selectedClient = clients.find(
          client => client.passportNumber === formData.clientPassport
        );
        
        // Для заказов сохраняем напрямую в Firebase в коллекцию Orders с фото
        const orderData = {
          brand: formData.brand,
          model: formData.model,
          year: parseInt(formData.year),
          vin: formData.vin,
          mileage: parseInt(formData.mileage),
          color: formData.color || '#000000',
          engineVolume: formData.engineVolume,
          fuel: formData.fuel,
          transmission: formData.transmission,
          drive: formData.drive,
          steering: formData.steering,
          condition: formData.condition,
          carfax: formData.carfax || '',
          purchasePrice: parseFloat(formData.purchaseCost) || 0,
          deliveryCost: parseFloat(formData.deliveryCost) || 0,
          customsCost: parseFloat(formData.customsCost) || 0,
          repairCost: parseFloat(formData.repairCost) || 0,
          otherCost: parseFloat(formData.otherCost) || 0,
          sellingPrice: parseFloat(formData.sellingPrice) || 0,
          managerName: selectedClient?.name || '',
          managerPassport: formData.clientPassport,
          status: 'in_korea',
        };
        
        // Создаем заказ с фотографиями
        await carService.createCarWithPhotos(orderData, selectedPhotos);
        
        // Вызываем onSubmit для обновления списка в родительском компоненте
        if (onSubmit) {
          await onSubmit(formData);
        }
      } else {
        await onSubmit(formData);
      }
      setFormData({});
      setSelectedPhotos([]);
      setCurrentStep(1);
      onClose();
    } catch (error) {
      console.error('Error submitting:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({});
    setSearchValue('');
    setCarSearchValue('');
    setCurrentStep(1);
    selectedPhotos.forEach(photo => {
      URL.revokeObjectURL(photo.preview);
    });
    setSelectedPhotos([]);
    onClose();
  };

  // Конфигурация для разных типов модалок
  const getModalConfig = () => {
    switch (type) {
      case 'car':
        return {
          title: 'Добавить автомобиль',
          fields: [
            {
              name: 'brand',
              label: 'Марка',
              type: 'input',
              required: true,
              placeholder: 'Hyundai, Kia, Genesis',
            },
            {
              name: 'model',
              label: 'Модель',
              type: 'input',
              required: true,
              placeholder: 'Sonata, Sportage, G80',
            },
            {
              name: 'year',
              label: 'Год выпуска',
              type: 'input',
              inputType: 'number',
              required: true,
              placeholder: '2024',
            },
            {
              name: 'vin',
              label: 'VIN код',
              type: 'input',
              required: true,
              placeholder: 'KMHXX00XXXX000000',
            },
            {
              name: 'mileage',
              label: 'Пробег (км)',
              type: 'input',
              inputType: 'number',
              required: true,
              placeholder: '50000',
            },
            {
              name: 'color',
              label: 'Цвет',
              type: 'color',
              required: true,
              placeholder: '#000000',
            },
            {
              name: 'engineVolume',
              label: 'Объем двигателя (л)',
              type: 'input',
              required: true,
              placeholder: '2.5',
            },
            {
              name: 'fuel',
              label: 'Тип топлива',
              type: 'select',
              required: true,
              placeholder: 'Выберите тип топлива',
              options: [
                { value: 'Бензин', label: 'Бензин' },
                { value: 'Дизель', label: 'Дизель' },
                { value: 'Гибрид', label: 'Гибрид' },
                { value: 'Электро', label: 'Электро' },
              ],
            },
            {
              name: 'transmission',
              label: 'Коробка передач',
              type: 'select',
              required: true,
              placeholder: 'Выберите тип коробки',
              options: [
                { value: 'Автомат', label: 'Автомат' },
                { value: 'Механика', label: 'Механика' },
                { value: 'Робот', label: 'Робот' },
                { value: 'Вариатор', label: 'Вариатор' },
              ],
            },
            {
              name: 'drive',
              label: 'Привод',
              type: 'select',
              required: true,
              placeholder: 'Выберите тип привода',
              options: [
                { value: 'Передний', label: 'Передний' },
                { value: 'Задний', label: 'Задний' },
                { value: 'Полный', label: 'Полный' },
              ],
            },
            {
              name: 'steering',
              label: 'Руль',
              type: 'select',
              required: true,
              placeholder: 'Выберите расположение руля',
              options: [
                { value: 'Слева', label: 'Слева' },
                { value: 'Справа', label: 'Справа' },
              ],
            },
            {
              name: 'condition',
              label: 'Состояние',
              type: 'select',
              required: true,
              placeholder: 'Выберите состояние',
              options: [
                { value: 'Отличное', label: 'Отличное' },
                { value: 'Хорошее', label: 'Хорошее' },
                { value: 'Среднее', label: 'Среднее' },
                { value: 'Битая', label: 'Битая' },
              ],
            },
            ...(formData.condition === 'Битая' ? [
              {
                name: 'carfax',
                label: 'Карфакс (описание повреждений)',
                type: 'textarea',
                required: true,
                placeholder: 'Опишите все повреждения автомобиля...',
              },
            ] : []),
          ],
          step3Fields: [
            {
              name: 'purchaseCost',
              label: 'Закупка авто ($)',
              type: 'input',
              inputType: 'number',
              required: true,
              placeholder: '15000',
            },
            {
              name: 'deliveryCost',
              label: 'Доставка ($)',
              type: 'input',
              inputType: 'number',
              required: true,
              placeholder: '1500',
            },
            {
              name: 'customsCost',
              label: 'Растаможка ($)',
              type: 'input',
              inputType: 'number',
              required: true,
              placeholder: '2000',
            },
            {
              name: 'repairCost',
              label: 'Ремонт ($)',
              type: 'input',
              inputType: 'number',
              required: true,
              placeholder: '500',
            },
            {
              name: 'otherCost',
              label: 'Прочее ($)',
              type: 'input',
              inputType: 'number',
              required: true,
              placeholder: '300',
            },
            {
              name: 'sellingPrice',
              label: 'Цена продажи ($)',
              type: 'input',
              inputType: 'number',
              required: true,
              placeholder: '22000',
            },
          ],
        };

      case 'client':
        return {
          title: 'Добавить сотрудника',
          fields: [
            {
              name: 'name',
              label: 'ФИО',
              type: 'input',
              required: true,
              placeholder: 'Иванов Иван Иванович',
            },
            {
              name: 'passportNumber',
              label: 'ИНН паспорта',
              type: 'input',
              required: true,
              placeholder: '12345678901234',
              maxLength: 14,
              isNumeric: true,
            },
            {
              name: 'password',
              label: 'Пароль',
              type: 'input',
              inputType: 'password',
              required: true,
              placeholder: 'Введите пароль',
            },
            {
              name: 'phone',
              label: 'Телефон',
              type: 'phone',
              required: true,
              placeholder: '+996 XXX XXX XXX',
            },
            {
              name: 'email',
              label: 'Email',
              type: 'input',
              inputType: 'email',
              required: false,
              placeholder: 'client@example.com',
            },
          ],
        };

      case 'order':
        return {
          title: 'Создать заказ',
          fields: [
          {
              name: 'clientPassport',
              label: 'Сотрудник',
              type: 'autocomplete',
              required: true,
              placeholder: 'Введите ИНН или имя сотрудника',
            },
            {
              name: 'brand',
              label: 'Марка',
              type: 'input',
              required: true,
              placeholder: 'Hyundai, Kia, Genesis',
            },
            {
              name: 'model',
              label: 'Модель',
              type: 'input',
              required: true,
              placeholder: 'Sonata, Sportage, G80',
            },
            {
              name: 'year',
              label: 'Год выпуска',
              type: 'input',
              inputType: 'number',
              required: true,
              placeholder: '2024',
            },
            {
              name: 'vin',
              label: 'VIN код',
              type: 'input',
              required: true,
              placeholder: 'KMHXX00XXXX000000',
            },
            {
              name: 'mileage',
              label: 'Пробег (км)',
              type: 'input',
              inputType: 'number',
              required: true,
              placeholder: '50000',
            },
            {
              name: 'color',
              label: 'Цвет',
              type: 'color',
              required: true,
              placeholder: '#000000',
            },
            {
              name: 'engineVolume',
              label: 'Объем двигателя (л)',
              type: 'input',
              required: true,
              placeholder: '2.5',
            },
            {
              name: 'fuel',
              label: 'Тип топлива',
              type: 'select',
              required: true,
              placeholder: 'Выберите тип топлива',
              options: [
                { value: 'Бензин', label: 'Бензин' },
                { value: 'Дизель', label: 'Дизель' },
                { value: 'Гибрид', label: 'Гибрид' },
                { value: 'Электро', label: 'Электро' },
              ],
            },
            {
              name: 'transmission',
              label: 'Коробка передач',
              type: 'select',
              required: true,
              placeholder: 'Выберите тип коробки',
              options: [
                { value: 'Автомат', label: 'Автомат' },
                { value: 'Механика', label: 'Механика' },
                { value: 'Робот', label: 'Робот' },
                { value: 'Вариатор', label: 'Вариатор' },
              ],
            },
            {
              name: 'drive',
              label: 'Привод',
              type: 'select',
              required: true,
              placeholder: 'Выберите тип привода',
              options: [
                { value: 'Передний', label: 'Передний' },
                { value: 'Задний', label: 'Задний' },
                { value: 'Полный', label: 'Полный' },
              ],
            },
            {
              name: 'steering',
              label: 'Руль',
              type: 'select',
              required: true,
              placeholder: 'Выберите расположение руля',
              options: [
                { value: 'Слева', label: 'Слева' },
                { value: 'Справа', label: 'Справа' },
              ],
            },
            {
              name: 'condition',
              label: 'Состояние',
              type: 'select',
              required: true,
              placeholder: 'Выберите состояние',
              options: [
                { value: 'Отличное', label: 'Отличное' },
                { value: 'Хорошее', label: 'Хорошее' },
                { value: 'Среднее', label: 'Среднее' },
                { value: 'Битая', label: 'Битая' },
              ],
            },
            ...(formData.condition === 'Битая' ? [
              {
                name: 'carfax',
                label: 'Карфакс (описание повреждений)',
                type: 'textarea',
                required: true,
                placeholder: 'Опишите все повреждения автомобиля...',
              },
            ] : []),
          ],
          step3Fields: [
            {
              name: 'purchaseCost',
              label: 'Закупка авто ($)',
              type: 'input',
              inputType: 'number',
              required: true,
              placeholder: '15000',
            },
            {
              name: 'deliveryCost',
              label: 'Доставка ($)',
              type: 'input',
              inputType: 'number',
              required: true,
              placeholder: '1500',
            },
            {
              name: 'customsCost',
              label: 'Растаможка ($)',
              type: 'input',
              inputType: 'number',
              required: true,
              placeholder: '2000',
            },
            {
              name: 'repairCost',
              label: 'Ремонт ($)',
              type: 'input',
              inputType: 'number',
              required: true,
              placeholder: '500',
            },
            {
              name: 'otherCost',
              label: 'Прочее ($)',
              type: 'input',
              inputType: 'number',
              required: true,
              placeholder: '300',
            },
            {
              name: 'sellingPrice',
              label: 'Цена продажи ($)',
              type: 'input',
              inputType: 'number',
              required: true,
              placeholder: '22000',
            },
          ],
        };

      default:
        return { title: 'Добавить', fields: [] };
    }
  };

  const config = getModalConfig();

  const renderField = (field) => {
    const commonProps = {
      label: field.label,
      placeholder: field.placeholder,
      value: formData[field.name] || '',
      variant: 'bordered',
      labelPlacement: 'outside',
      classNames: {
        label: 'text-default-700 font-medium',
      },
    };

    switch (field.type) {
      case 'phone':
        return (
          <Input
            key={field.name}
            {...commonProps}
            type="tel"
            value={formData[field.name] || '+996 '}
            onChange={(e) => handlePhoneChange(e.target.value)}
            maxLength={16}
          />
        );

      case 'input':
        return (
          <Input
            key={field.name}
            {...commonProps}
            type={field.inputType || 'text'}
            onChange={(e) => {
              if (field.isNumeric) {
                handlePassportChange(e.target.value);
              } else {
                handleInputChange(field.name, e.target.value);
              }
            }}
            maxLength={field.maxLength}
          />
        );

      case 'color':
        return (
          <div key={field.name} className="flex flex-col gap-2">
            <label className="text-sm font-medium text-default-700">
              {field.label}
            </label>
            <div className="flex gap-2 items-center">
              <input
                type="color"
                value={formData[field.name] || '#000000'}
                onChange={(e) => handleInputChange(field.name, e.target.value || '#000000')}
                className="h-10 w-20 rounded-lg border-2 border-default-200 cursor-pointer"
              />
              <Input
                value={formData[field.name] || '#000000'}
                onChange={(e) => handleInputChange(field.name, e.target.value || '#000000')}
                placeholder={field.placeholder}
                variant="bordered"
                className="flex-1"
              />
            </div>
          </div>
        );

      case 'select':
        return (
          <Select
            key={field.name}
            {...commonProps}
            placeholder={field.placeholder || field.label}
            selectedKeys={formData[field.name] ? [formData[field.name]] : []}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
          >
            {field.options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </Select>
        );

      case 'autocomplete':
        return (
          <Autocomplete
            key={field.name}
            {...commonProps}
            inputValue={searchValue}
            onInputChange={setSearchValue}
            onSelectionChange={(key) => {
              if (key) {
                const client = clients.find(c => c.passportNumber === key);
                handleInputChange(field.name, key);
                if (client) {
                  handleInputChange('clientName', client.name);
                }
              }
            }}
            listboxProps={{
              emptyContent: "Сотрудник не найден",
            }}
          >
            {filteredClients.map((client) => (
              <AutocompleteItem 
                key={client.passportNumber} 
                value={client.passportNumber}
                textValue={client.passportNumber}
              >
                <div className="flex flex-col">
                  <span className="text-sm">{client.passportNumber}</span>
                  <span className="text-xs text-default-400">{client.name}</span>
                </div>
              </AutocompleteItem>
            ))}
          </Autocomplete>
        );

      case 'autocomplete-car':
        return (
          <Autocomplete
            {...commonProps}
            inputValue={carSearchValue}
            onInputChange={setCarSearchValue}
            onSelectionChange={(key) => {
              if (key) {
                const car = cars.find(c => c.vin === key);
                handleInputChange(field.name, key);
                if (car) {
                  handleInputChange('carInfo', `${car.brand} ${car.model} ${car.year}`);
                }
              }
            }}
            listboxProps={{
              emptyContent: "Автомобиль не найден",
            }}
          >
            {filteredCars.map((car) => (
              <AutocompleteItem 
                key={car.vin} 
                value={car.vin}
                textValue={car.vin}
              >
                <div className="flex flex-col">
                  <span className="text-sm">{car.vin}</span>
                  <span className="text-xs text-default-400">{car.brand} {car.model} {car.year}</span>
                </div>
              </AutocompleteItem>
            ))}
          </Autocomplete>
        );

      case 'textarea':
        return (
          <Textarea
            {...commonProps}
            minRows={3}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
          />
        );

      default:
        return null;
    }
  };

  const handleNext = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (type === 'order' && currentStep < 3) {
      setCurrentStep(prev => prev + 1);
    } else if (type === 'car' && currentStep === 1) {
      setCurrentStep(2);
    }
  };

  const handleBack = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
    }
  };

  // Определяем какие поля показывать
  const fieldsToShow = useMemo(() => {
    if (type === 'car' && currentStep === 2) {
      return config.step2Fields || config.step3Fields;
    }
    if (type === 'order') {
      if (currentStep === 2) return []; // Фото шаг
      if (currentStep === 3) return config.step3Fields;
    }
    return config.fields;
  }, [type, currentStep, config]);
  

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size="2xl"
      scrollBehavior="inside"
      classNames={{
        base: "rounded-2xl",
        wrapper: "rounded-2xl",
        body: "overflow-y-auto max-h-[60vh]",
        backdrop: "bg-overlay/50 backdrop-opacity-disabled",
      }}
    >
      <ModalContent className="rounded-2xl">
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1 sticky top-0 bg-content1 z-10">
              <h2 className="text-xl font-bold">
                {type === 'order' && currentStep === 2 ? 'Загрузка фотографий' :
                 (type === 'car' && currentStep === 2) || (type === 'order' && currentStep === 3) ? 'Себестоимость и цена' :
                 config.title}
              </h2>
              {((type === 'car' && currentStep === 2) || (type === 'order' && currentStep === 3)) ? (
                <div className="flex flex-col gap-1">
                  <p className="text-2xl font-bold text-primary">
                    Себестоимость: ${totalCost.toLocaleString()}
                  </p>
                </div>
              ) : type === 'order' && currentStep === 2 ? (
                <p className="text-sm text-default-500 font-normal">
                  Добавьте фотографии автомобиля
                </p>
              ) : (
                (type === 'car' || type === 'order') && (
                  <p className="text-sm text-default-500 font-normal">
                    Шаг {currentStep} из {type === 'order' ? 3 : 2}
                  </p>
                )
              )}
            </ModalHeader>
            
            <ModalBody className="overflow-y-auto">
              {type === 'order' && currentStep === 2 ? (
                <div className="py-4">
                  {/* Кнопка загрузки */}
                  <div className="mb-4">
                    <input
                      type="file"
                      id="photo-upload"
                      multiple
                      accept="image/*"
                      onChange={handlePhotoSelect}
                      className="hidden"
                    />
                    <label
                      htmlFor="photo-upload"
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-default-300 rounded-lg cursor-pointer hover:border-primary hover:bg-default-50 transition-colors"
                    >
                      <Plus size={32} className="text-default-400 mb-2" />
                      <span className="text-sm text-default-600 font-medium">
                        Нажмите для выбора фотографий
                      </span>
                      <span className="text-xs text-default-400 mt-1">
                        Можно выбрать несколько изображений
                      </span>
                    </label>
                  </div>

                  {/* Предпросмотр фотографий */}
                  {selectedPhotos.length > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-3">
                        Выбрано фото: {selectedPhotos.length}
                      </p>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {selectedPhotos.map((photo) => (
                          <div
                            key={photo.id}
                            className="relative group aspect-square rounded-lg overflow-hidden border-2 border-default-200"
                          >
                            <img
                              src={photo.preview}
                              alt={photo.name}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <Button
                                isIconOnly
                                color="danger"
                                size="sm"
                                onPress={() => handlePhotoRemove(photo.id)}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <path d="M18 6L6 18M6 6l12 12" />
                                </svg>
                              </Button>
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 bg-black/70 px-2 py-1">
                              <p className="text-xs text-white truncate">
                                {photo.name}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-2">
                  {fieldsToShow?.map((field) => (
                    <div
                      key={field.name}
                      className={field.type === 'textarea' ? 'md:col-span-2' : ''}
                    >
                      {renderField(field)}
                    </div>
                  ))}
                </div>
              )}
            </ModalBody>
            
            <ModalFooter className="sticky bottom-0 bg-content1 border-t border-divider z-10 gap-2">
              {((type === 'car' && currentStep === 2) || (type === 'order' && currentStep > 1)) && (
                <Button
                  type="button"
                  variant="light"
                  onPress={handleBack}
                  isDisabled={isLoading}
                >
                  Назад
                </Button>
              )}
              <Button
                type="button"
                color="danger"
                variant="light"
                onPress={handleClose}
                isDisabled={isLoading}
              >
                Отмена
              </Button>
              {((type === 'car' && currentStep === 1) || (type === 'order' && currentStep < 3)) ? (
                <Button
                  color="primary"
                  type="button"
                  onPress={() => {
                    handleNext();
                  }}
                  isDisabled={isLoading}
                >
                  Следующий
                </Button>
              ) : (
                <Button
                  color="primary"
                  onClick={handleSubmit}
                  isLoading={isLoading}
                >
                  Сохранить
                </Button>
              )}
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
