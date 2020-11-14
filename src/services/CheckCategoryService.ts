import { getRepository } from 'typeorm';

import Category from '../models/Category';

class CheckCategoryService {
  public async execute(title: string): Promise<string> {
    const categoriesRepository = getRepository(Category);

    const category = await categoriesRepository.findOne({ where: { title } });
    if (category) {
      return category.id;
    }
    const newCategory = await categoriesRepository.create({
      title,
    });

    await categoriesRepository.save(newCategory);
    return newCategory.id;
  }
}

export default CheckCategoryService;
