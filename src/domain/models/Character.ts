export class Character {
  link: string;
  title: string;
  image: string;
  category: string;

  constructor(link: string, title: string, image: string, category: string) {
    this.link = link;
    this.title = title;
    this.image = image;
    this.category = category;
  }
}