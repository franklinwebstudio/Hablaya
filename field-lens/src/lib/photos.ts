export type Photo = {
  id: string;
  title: string;
  place: string;
  src: string;
  width: number;
  height: number;
  sample?: boolean;
};

/** Built-in sample rolls shown until the visitor adds their own photos. */
export const SAMPLE_PHOTOS: Photo[] = [
  {
    id: "sample-1",
    title: "Ridge light",
    place: "High desert",
    src: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1600&q=80",
    width: 1600,
    height: 1067,
    sample: true,
  },
  {
    id: "sample-2",
    title: "Morning mist",
    place: "Pine valley",
    src: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1400&q=80",
    width: 1400,
    height: 933,
    sample: true,
  },
  {
    id: "sample-3",
    title: "Golden trail",
    place: "Coast range",
    src: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1600&q=80",
    width: 1600,
    height: 1067,
    sample: true,
  },
  {
    id: "sample-4",
    title: "Quiet water",
    place: "Alpine lake",
    src: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?auto=format&fit=crop&w=1400&q=80",
    width: 1400,
    height: 933,
    sample: true,
  },
  {
    id: "sample-5",
    title: "Wind grass",
    place: "Open field",
    src: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1600&q=80",
    width: 1600,
    height: 1067,
    sample: true,
  },
  {
    id: "sample-6",
    title: "Last sun",
    place: "Canyon rim",
    src: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=80",
    width: 1400,
    height: 933,
    sample: true,
  },
];

export const HERO_PHOTO = SAMPLE_PHOTOS[0];
