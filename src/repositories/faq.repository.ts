import { faqModel } from '@/models/faq.model'
import { pgDatabase } from '@/pg-database'
import { faq, findFaq, newFaq, UpdateFaq } from '@/types/faq.type'
import { PgDatabase } from '@/types/pg-database.type'
import { eq } from 'drizzle-orm'

export class FAQRepository {
  private readonly _db: PgDatabase = pgDatabase

  public async findAll(): Promise<findFaq[]> {
    return (
      (await this._db
        .select({
          id: faqModel.id,
          question: faqModel.question,
          answer: faqModel.answer
        })
        .from(faqModel)) || []
    )
  }

  public async create(newFaq: newFaq): Promise<newFaq | undefined> {
    const rows = await this._db.insert(faqModel).values(newFaq).returning({
      id: faqModel.id,
      question: faqModel.question,
      answer: faqModel.answer
    })

    return rows.at(0)
  }

  public async update(id: faq['id'], updateFaq: UpdateFaq): Promise<findFaq | undefined> {
    const rows = await this._db
      .update(faqModel)
      .set(updateFaq)
      .where(eq(faqModel.id, id))
      .returning({
        id: faqModel.id,
        question: faqModel.question,
        answer: faqModel.answer
      })

    return rows.at(0)
  }

  public async delete(id: faq['id']): Promise<findFaq | undefined> {
    const rows = await this._db.delete(faqModel).where(eq(faqModel.id, id)).returning({
      id: faqModel.id,
      question: faqModel.question,
      answer: faqModel.answer
    })

    return rows.at(0)
  }
}
