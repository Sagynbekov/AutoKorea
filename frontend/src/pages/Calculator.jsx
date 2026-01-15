import { useState, useMemo } from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  Input,
  Button,
  Divider,
  Select,
  SelectItem,
  Slider,
  Chip,
} from '@heroui/react';
import {
  Calculator as CalcIcon,
  DollarSign,
  Ship,
  FileText,
  Wrench,
  Percent,
  RefreshCw,
  Save,
  TrendingUp,
} from 'lucide-react';
import { formatCurrency } from '../data/mockData';

// Курсы валют (mock)
const exchangeRates = {
  KRW_USD: 0.00075, // 1 KRW = 0.00075 USD
  USD_RUB: 92.5,     // 1 USD = 92.5 RUB
};

// Тарифы доставки
const shippingRates = {
  economy: { label: 'Эконом (60-90 дней)', price: 900 },
  standard: { label: 'Стандарт (45-60 дней)', price: 1200 },
  express: { label: 'Экспресс (30-45 дней)', price: 1600 },
};

// Расчет таможенной пошлины (упрощенный)
const calculateCustomsDuty = (priceUSD, engineVolume, engineType, carAge) => {
  // Упрощенная формула для примера
  let dutyRate = 0.15; // Базовая ставка 15%
  
  // Корректировка по объему двигателя
  if (parseFloat(engineVolume) > 3.0) dutyRate += 0.05;
  else if (parseFloat(engineVolume) > 2.0) dutyRate += 0.02;
  
  // Электрокары
  if (engineType === 'electric') return 0;
  
  // Возраст авто
  if (carAge > 5) dutyRate += 0.1;
  else if (carAge > 3) dutyRate += 0.05;
  
  return priceUSD * dutyRate;
};

// Расчет НДС
const calculateVAT = (priceUSD, customsDuty) => {
  return (priceUSD + customsDuty) * 0.20; // 20% НДС
};

// Расчет утилизационного сбора
const calculateRecyclingFee = (engineVolume, carAge) => {
  const baseRate = 20000; // Базовая ставка в рублях
  let coefficient = 1;
  
  if (parseFloat(engineVolume) > 3.5) coefficient = 5.73;
  else if (parseFloat(engineVolume) > 3.0) coefficient = 4.5;
  else if (parseFloat(engineVolume) > 2.0) coefficient = 3.2;
  else if (parseFloat(engineVolume) > 1.0) coefficient = 1.84;
  
  // Увеличение для старых авто
  if (carAge > 3) coefficient *= 1.5;
  
  return (baseRate * coefficient) / exchangeRates.USD_RUB; // Конвертируем в USD
};

export default function Calculator() {
  // Входные данные
  const [priceKRW, setPriceKRW] = useState('25000000');
  const [engineVolume, setEngineVolume] = useState('2.0');
  const [engineType, setEngineType] = useState('gasoline');
  const [carAge, setCarAge] = useState(1);
  const [shippingType, setShippingType] = useState('standard');
  const [repairCost, setRepairCost] = useState('0');
  const [additionalCost, setAdditionalCost] = useState('200');
  const [desiredMargin, setDesiredMargin] = useState(15);

  // Расчеты
  const calculations = useMemo(() => {
    const priceUSD = parseInt(priceKRW || 0) * exchangeRates.KRW_USD;
    const shipping = shippingRates[shippingType].price;
    const customs = calculateCustomsDuty(priceUSD, engineVolume, engineType, carAge);
    const vat = calculateVAT(priceUSD, customs);
    const recycling = calculateRecyclingFee(engineVolume, carAge);
    const repair = parseFloat(repairCost) || 0;
    const additional = parseFloat(additionalCost) || 0;

    const totalCost = priceUSD + shipping + customs + vat + recycling + repair + additional;
    const recommendedPrice = totalCost * (1 + desiredMargin / 100);
    const profit = recommendedPrice - totalCost;

    return {
      priceUSD: Math.round(priceUSD),
      shipping,
      customs: Math.round(customs),
      vat: Math.round(vat),
      recycling: Math.round(recycling),
      repair,
      additional,
      totalCost: Math.round(totalCost),
      recommendedPrice: Math.round(recommendedPrice),
      profit: Math.round(profit),
      priceRUB: Math.round(recommendedPrice * exchangeRates.USD_RUB),
    };
  }, [priceKRW, engineVolume, engineType, carAge, shippingType, repairCost, additionalCost, desiredMargin]);

  const resetForm = () => {
    setPriceKRW('25000000');
    setEngineVolume('2.0');
    setEngineType('gasoline');
    setCarAge(1);
    setShippingType('standard');
    setRepairCost('0');
    setAdditionalCost('200');
    setDesiredMargin(15);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Калькулятор</h1>
          <p className="text-default-500">Расчет стоимости автомобиля из Кореи</p>
        </div>
        <div className="flex gap-2">
          <Button variant="bordered" startContent={<RefreshCw size={16} />} onPress={resetForm}>
            Сбросить
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Car Price */}
          <Card className="border border-default-200">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <DollarSign size={20} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Стоимость автомобиля</h3>
                  <p className="text-sm text-default-500">Цена на аукционе в Корее</p>
                </div>
              </div>
            </CardHeader>
            <CardBody className="space-y-4">
              <Input
                type="number"
                label="Цена в вонах (KRW)"
                placeholder="25000000"
                value={priceKRW}
                onValueChange={setPriceKRW}
                startContent={<span className="text-default-400">₩</span>}
                description={`≈ ${formatCurrency(calculations.priceUSD)}`}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="text"
                  label="Объем двигателя (л)"
                  placeholder="2.0"
                  value={engineVolume}
                  onValueChange={setEngineVolume}
                />
                <Select
                  label="Тип двигателя"
                  selectedKeys={[engineType]}
                  onChange={(e) => setEngineType(e.target.value)}
                >
                  <SelectItem key="gasoline">Бензин</SelectItem>
                  <SelectItem key="diesel">Дизель</SelectItem>
                  <SelectItem key="hybrid">Гибрид</SelectItem>
                  <SelectItem key="electric">Электро</SelectItem>
                </Select>
              </div>

              <div>
                <p className="text-sm mb-3">Возраст автомобиля: <strong>{carAge} {carAge === 1 ? 'год' : carAge < 5 ? 'года' : 'лет'}</strong></p>
                <Slider
                  step={1}
                  minValue={0}
                  maxValue={10}
                  value={carAge}
                  onChange={setCarAge}
                  className="max-w-full"
                  marks={[
                    { value: 0, label: 'Новый' },
                    { value: 3, label: '3' },
                    { value: 5, label: '5' },
                    { value: 10, label: '10' },
                  ]}
                />
              </div>
            </CardBody>
          </Card>

          {/* Shipping */}
          <Card className="border border-default-200">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-warning/10 rounded-lg">
                  <Ship size={20} className="text-warning" />
                </div>
                <div>
                  <h3 className="font-semibold">Доставка</h3>
                  <p className="text-sm text-default-500">Выберите тип доставки</p>
                </div>
              </div>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {Object.entries(shippingRates).map(([key, value]) => (
                  <Card
                    key={key}
                    isPressable
                    onPress={() => setShippingType(key)}
                    className={`border-2 ${shippingType === key ? 'border-primary bg-primary/5' : 'border-default-200'}`}
                  >
                    <CardBody className="p-4 text-center">
                      <p className="font-medium">{value.label.split(' ')[0]}</p>
                      <p className="text-xs text-default-500 mb-2">{value.label.split(' ').slice(1).join(' ')}</p>
                      <p className="text-lg font-bold text-primary">{formatCurrency(value.price)}</p>
                    </CardBody>
                  </Card>
                ))}
              </div>
            </CardBody>
          </Card>

          {/* Additional Costs */}
          <Card className="border border-default-200">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-secondary/10 rounded-lg">
                  <Wrench size={20} className="text-secondary" />
                </div>
                <div>
                  <h3 className="font-semibold">Дополнительные расходы</h3>
                  <p className="text-sm text-default-500">Ремонт и прочее</p>
                </div>
              </div>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="number"
                  label="Ремонт (USD)"
                  placeholder="0"
                  value={repairCost}
                  onValueChange={setRepairCost}
                  startContent={<span className="text-default-400">$</span>}
                />
                <Input
                  type="number"
                  label="Прочие расходы (USD)"
                  placeholder="200"
                  value={additionalCost}
                  onValueChange={setAdditionalCost}
                  startContent={<span className="text-default-400">$</span>}
                />
              </div>
            </CardBody>
          </Card>

          {/* Margin */}
          <Card className="border border-default-200">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-success/10 rounded-lg">
                  <Percent size={20} className="text-success" />
                </div>
                <div>
                  <h3 className="font-semibold">Желаемая маржа</h3>
                  <p className="text-sm text-default-500">Процент прибыли</p>
                </div>
              </div>
            </CardHeader>
            <CardBody>
              <p className="text-sm mb-3">Маржа: <strong>{desiredMargin}%</strong></p>
              <Slider
                step={1}
                minValue={5}
                maxValue={40}
                value={desiredMargin}
                onChange={setDesiredMargin}
                className="max-w-full"
                color="success"
                marks={[
                  { value: 5, label: '5%' },
                  { value: 15, label: '15%' },
                  { value: 25, label: '25%' },
                  { value: 40, label: '40%' },
                ]}
              />
            </CardBody>
          </Card>
        </div>

        {/* Results */}
        <div className="space-y-6">
          {/* Summary Card */}
          <Card className="border border-default-200 sticky top-20">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <CalcIcon size={20} className="text-primary" />
                </div>
                <h3 className="font-semibold">Итоговый расчет</h3>
              </div>
            </CardHeader>
            <CardBody className="space-y-4">
              {/* Cost breakdown */}
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-default-500">Цена авто</span>
                  <span className="font-medium">{formatCurrency(calculations.priceUSD)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-default-500">Доставка</span>
                  <span className="font-medium">{formatCurrency(calculations.shipping)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-default-500">Таможенная пошлина</span>
                  <span className="font-medium">{formatCurrency(calculations.customs)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-default-500">НДС (20%)</span>
                  <span className="font-medium">{formatCurrency(calculations.vat)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-default-500">Утилизационный сбор</span>
                  <span className="font-medium">{formatCurrency(calculations.recycling)}</span>
                </div>
                {calculations.repair > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-default-500">Ремонт</span>
                    <span className="font-medium">{formatCurrency(calculations.repair)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-default-500">Прочее</span>
                  <span className="font-medium">{formatCurrency(calculations.additional)}</span>
                </div>
              </div>

              <Divider />

              {/* Total cost */}
              <div className="flex justify-between">
                <span className="font-medium">Себестоимость</span>
                <span className="font-bold text-lg">{formatCurrency(calculations.totalCost)}</span>
              </div>

              <Divider />

              {/* Recommended price */}
              <div className="p-4 bg-primary/10 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-default-500">Рекомендуемая цена</span>
                  <Chip color="primary" size="sm">{desiredMargin}% маржа</Chip>
                </div>
                <p className="text-3xl font-bold text-primary">{formatCurrency(calculations.recommendedPrice)}</p>
                <p className="text-sm text-default-500 mt-1">
                  ≈ {calculations.priceRUB.toLocaleString()} ₽
                </p>
              </div>

              {/* Profit */}
              <div className="p-4 bg-success/10 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-default-500 mb-1">Прибыль</p>
                    <p className="text-2xl font-bold text-success">{formatCurrency(calculations.profit)}</p>
                  </div>
                  <TrendingUp size={32} className="text-success" />
                </div>
              </div>

              <Divider />

              {/* Exchange rates info */}
              <div className="text-xs text-default-400 space-y-1">
                <p>Курсы валют (ориентировочные):</p>
                <p>1 USD = 1,333 KRW</p>
                <p>1 USD = {exchangeRates.USD_RUB} RUB</p>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
