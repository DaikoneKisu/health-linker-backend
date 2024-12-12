import { faqModel } from '@/models/faq.model'
import { pgDatabase } from '@/pg-database'
import { faq, newFaq } from '@/types/faq.type'
import { PgDatabase } from '@/types/pg-database.type'

export class FAQRepository {
  private readonly _db: PgDatabase = pgDatabase

  public async findAll(): Promise<faq[]> {
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
}
