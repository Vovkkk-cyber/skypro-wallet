import { FoodIcon, TransportIcon, HousingIcon, EntertainmentIcon, EducationIcon, OtherIcon } from '../components/Icons';

export const categories = [
  { value: '', label: 'Все', icon: null },
  { value: 'food', label: 'Еда', icon: FoodIcon },
  { value: 'transport', label: 'Транспорт', icon: TransportIcon },
  { value: 'housing', label: 'Жилье', icon: HousingIcon },
  { value: 'joy', label: 'Развлечения', icon: EntertainmentIcon },
  { value: 'education', label: 'Образование', icon: EducationIcon },
  { value: 'others', label: 'Другое', icon: OtherIcon },
];