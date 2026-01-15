import { useState, useMemo } from 'react';
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
import { clients, cars } from '../data/mockData';

/**
 * Универсальная модалка для добавления различных сущностей
 * @param {boolean} isOpen - Открыта ли модалка
 * @param {function} onClose - Функция закрытия модалки
 * @param {string} type - Тип модалки: 'car', 'client', 'order'
 * @param {function} onSubmit - Функция обработки отправки формы
 */
export default function AddModal({ isOpen, onClose, type, onSubmit }) {
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [carSearchValue, setCarSearchValue] = useState('');
  const [currentStep, setCurrentStep] = useState(1);

  // Вычисление себестоимости
  const totalCost = useMemo(() => {
    const purchase = parseFloat(formData.purchaseCost) || 0;
    const delivery = parseFloat(formData.deliveryCost) || 0;
    const customs = parseFloat(formData.customsCost) || 0;
    const repair = parseFloat(formData.repairCost) || 0;
    const other = parseFloat(formData.otherCost) || 0;
    return purchase + delivery + customs + repair + other;
  }, [formData.purchaseCost, formData.deliveryCost, formData.customsCost, formData.repairCost, formData.otherCost]);

  // Фильтрация клиентов по ИНН и имени
  const filteredClients = useMemo(() => {
    if (!searchValue) return clients;
    
    const search = searchValue.toLowerCase();
    return clients.filter(client => 
      client.passportNumber?.toLowerCase().includes(search) ||
      client.name.toLowerCase().includes(search)
    );
  }, [searchValue]);

  // Фильтрация автомобилей по VIN и марке/модели
  const filteredCars = useMemo(() => {
    if (!carSearchValue) return cars;
    
    const search = carSearchValue.toLowerCase();
    return cars.filter(car => 
      car.vin?.toLowerCase().includes(search) ||
      `${car.brand} ${car.model}`.toLowerCase().includes(search)
    );
  }, [carSearchValue]);

  const handleInputChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('handleSubmit вызван. type:', type, 'currentStep:', currentStep);
    
    // Если это первый шаг для car/order, переходим на второй шаг вместо отправки
    if ((type === 'car' || type === 'order') && currentStep === 1) {
      console.log('Переход на шаг 2');
      setCurrentStep(2);
      return;
    }
    
    console.log('Отправка формы');
    setIsLoading(true);
    
    try {
      await onSubmit(formData);
      setFormData({});
      setCurrentStep(1); // Сбрасываем шаг при успешной отправке
      onClose();
    } catch (error) {
      console.error('Ошибка при сохранении:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({});
    setSearchValue('');
    setCarSearchValue('');
    setCurrentStep(1);
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
                { value: 'gasoline', label: 'Бензин' },
                { value: 'diesel', label: 'Дизель' },
                { value: 'hybrid', label: 'Гибрид' },
                { value: 'electric', label: 'Электро' },
              ],
            },
            {
              name: 'transmission',
              label: 'Коробка передач',
              type: 'select',
              required: true,
              placeholder: 'Выберите тип коробки',
              options: [
                { value: 'automatic', label: 'Автомат' },
                { value: 'manual', label: 'Механика' },
                { value: 'robot', label: 'Робот' },
                { value: 'cvt', label: 'Вариатор' },
              ],
            },
            {
              name: 'drive',
              label: 'Привод',
              type: 'select',
              required: true,
              placeholder: 'Выберите тип привода',
              options: [
                { value: 'fwd', label: 'Передний' },
                { value: 'rwd', label: 'Задний' },
                { value: 'awd', label: 'Полный' },
              ],
            },
            {
              name: 'steering',
              label: 'Руль',
              type: 'select',
              required: true,
              placeholder: 'Выберите расположение руля',
              options: [
                { value: 'left', label: 'Слева' },
                { value: 'right', label: 'Справа' },
              ],
            },
            {
              name: 'condition',
              label: 'Состояние',
              type: 'select',
              required: true,
              placeholder: 'Выберите состояние',
              options: [
                { value: 'excellent', label: 'Отличное' },
                { value: 'good', label: 'Хорошее' },
                { value: 'average', label: 'Среднее' },
                { value: 'damaged', label: 'Битая' },
              ],
            },
            ...(formData.condition === 'damaged' ? [
              {
                name: 'carfax',
                label: 'Карфакс (описание повреждений)',
                type: 'textarea',
                required: true,
                placeholder: 'Опишите все повреждения автомобиля...',
              },
            ] : []),
          ],
          step2Fields: [
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
          title: 'Добавить клиента',
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
              placeholder: '1234567890123',
            },
            {
              name: 'phone',
              label: 'Телефон',
              type: 'input',
              inputType: 'tel',
              required: true,
              placeholder: '+996 (XXX) XXX-XXX',
            },
            {
              name: 'email',
              label: 'Email',
              type: 'input',
              inputType: 'email',
              required: false,
              placeholder: 'client@example.com',
            },
            {
              name: 'notes',
              label: 'Примечания',
              type: 'textarea',
              placeholder: 'Дополнительная информация о клиенте...',
            },
          ],
        };

      case 'order':
        return {
          title: 'Создать заказ',
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
                { value: 'gasoline', label: 'Бензин' },
                { value: 'diesel', label: 'Дизель' },
                { value: 'hybrid', label: 'Гибрид' },
                { value: 'electric', label: 'Электро' },
              ],
            },
            {
              name: 'transmission',
              label: 'Коробка передач',
              type: 'select',
              required: true,
              placeholder: 'Выберите тип коробки',
              options: [
                { value: 'automatic', label: 'Автомат' },
                { value: 'manual', label: 'Механика' },
                { value: 'robot', label: 'Робот' },
                { value: 'cvt', label: 'Вариатор' },
              ],
            },
            {
              name: 'drive',
              label: 'Привод',
              type: 'select',
              required: true,
              placeholder: 'Выберите тип привода',
              options: [
                { value: 'fwd', label: 'Передний' },
                { value: 'rwd', label: 'Задний' },
                { value: 'awd', label: 'Полный' },
              ],
            },
            {
              name: 'steering',
              label: 'Руль',
              type: 'select',
              required: true,
              placeholder: 'Выберите расположение руля',
              options: [
                { value: 'left', label: 'Слева' },
                { value: 'right', label: 'Справа' },
              ],
            },
            {
              name: 'condition',
              label: 'Состояние',
              type: 'select',
              required: true,
              placeholder: 'Выберите состояние',
              options: [
                { value: 'excellent', label: 'Отличное' },
                { value: 'good', label: 'Хорошее' },
                { value: 'average', label: 'Среднее' },
                { value: 'damaged', label: 'Битая' },
              ],
            },
            ...(formData.condition === 'damaged' ? [
              {
                name: 'carfax',
                label: 'Карфакс (описание повреждений)',
                type: 'textarea',
                required: true,
                placeholder: 'Опишите все повреждения автомобиля...',
              },
            ] : []),
          ],
          step2Fields: [
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
      key: field.name,
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
      case 'input':
        return (
          <Input
            {...commonProps}
            type={field.inputType || 'text'}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
          />
        );

      case 'color':
        return (
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-default-700">
              {field.label}
            </label>
            <div className="flex gap-2 items-center">
              <input
                type="color"
                value={formData[field.name] || '#000000'}
                onChange={(e) => handleInputChange(field.name, e.target.value)}
                className="h-10 w-20 rounded-lg border-2 border-default-200 cursor-pointer"
              />
              <Input
                value={formData[field.name] || '#000000'}
                onChange={(e) => handleInputChange(field.name, e.target.value)}
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
              emptyContent: "Клиент не найден",
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
    console.log('handleNext вызван. type:', type, 'currentStep:', currentStep);
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if ((type === 'car' || type === 'order') && currentStep === 1) {
      console.log('Условие выполнено, переход на шаг 2');
      setCurrentStep(2);
    } else {
      console.log('Условие НЕ выполнено');
    }
  };

  const handleBack = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
    }
  };

  // Определяем какие поля показывать
  const fieldsToShow = (type === 'car' || type === 'order') && currentStep === 2 ? config.step2Fields : config.fields;
  
  console.log('Рендер модалки. type:', type, 'currentStep:', currentStep, 'fieldsToShow:', fieldsToShow?.length);

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
                {(type === 'car' || type === 'order') && currentStep === 2 ? 'Себестоимость и цена' : config.title}
              </h2>
              {(type === 'car' || type === 'order') && currentStep === 2 ? (
                <div className="flex flex-col gap-1">
                  <p className="text-2xl font-bold text-primary">
                    Себестоимость: ${totalCost.toLocaleString()}
                  </p>
                </div>
              ) : (
                (type === 'car' || type === 'order') && currentStep === 1 && (
                  <p className="text-sm text-default-500 font-normal">
                    Шаг 1 из 2
                  </p>
                )
              )}
            </ModalHeader>
            
            <ModalBody className="overflow-y-auto">
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
            </ModalBody>
            
            <ModalFooter className="sticky bottom-0 bg-content1 border-t border-divider z-10 gap-2">
              {(type === 'car' || type === 'order') && currentStep === 2 && (
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
              {(type === 'car' || type === 'order') && currentStep === 1 ? (
                <Button
                  color="primary"
                  type="button"
                  onPress={() => {
                    console.log('Кнопка "Следующий" нажата');
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
