import togetherOne from "../../assets/Events/alumni-together-1.jpg";
import togetherTwo from "../../assets/Events/alumni-together-2.jpg";
import together2025 from "../../assets/Events/alumni-together-2025.jpg";
import march from "../../assets/Events/alumni-march.jpg";
import sportOne from "../../assets/Events/alumni-sport-meet-1.jpg";
import sportTwo from "../../assets/Events/alumni-sport-meet-2.jpg";
import inaugurationOne from "../../assets/Events/inauguration-1.jpg";
import inaugurationTwo from "../../assets/Events/inauguration-2.jpg";

export const alumniEvents = [
  {
    slug: "alumni-get-together-2025",
    title: "Alumni Get Together 2025",
    date: "August 18, 2025",
    category: "Reunion",
    venue: "PSG Public Schools Campus",
    description: "A warm evening of familiar faces, shared stories, and new memories across generations of PSGPS alumni.",
    cover: together2025,
    images: [together2025, togetherOne, togetherTwo],
  },
  {
    slug: "alumni-sport-meet",
    title: "Alumni Sport Meet",
    date: "August 2, 2025",
    category: "Sports",
    venue: "PSGPS Sports Ground",
    description: "A spirited day of friendly competition, teamwork, and community beyond the classroom.",
    cover: sportOne,
    images: [sportOne, sportTwo],
  },
  {
    slug: "alumni-march-on",
    title: "Alumni March On",
    date: "August 15, 2022",
    category: "Community",
    venue: "Coimbatore",
    description: "A memorable alumni gathering celebrating the shared journey and enduring PSGPS spirit.",
    cover: march,
    images: [march],
  },
  {
    slug: "inauguration",
    title: "Alumni Association Inauguration",
    date: "2022",
    category: "Milestone",
    venue: "PSG Public Schools",
    description: "The beginning of a connected alumni community built on strong roots and a shared future.",
    cover: inaugurationOne,
    images: [inaugurationOne, inaugurationTwo],
  },
];

export const galleryAlbums = alumniEvents.map((event) => ({
  ...event,
  slug: event.slug,
  title: event.title,
}));

export function findEvent(slug) {
  return alumniEvents.find((event) => event.slug === slug);
}

export function findAlbum(slug) {
  return galleryAlbums.find((album) => album.slug === slug);
}
