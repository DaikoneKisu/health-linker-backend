import { desc, eq, like, or } from 'drizzle-orm'
import { PgDatabase } from '@/types/pg-database.type'
import { pgDatabase } from '@/pg-database'
import { educationalResourceModel } from '@/models/educational-resource.model'
import { adminModel } from '@/models/admin.model'
import { userModel } from '@/models/user.model'
import {
  EducationalResource,
  NewResourceAdmin,
  NewResourceSpecialist
} from '@/types/educational-resource.type'
import { UpdateEducationalResourceDto } from '@/dtos/educational-resource.dto'

export class EducationalResourceRepository {
  private readonly _db: PgDatabase = pgDatabase

  /**
   * Get all resources
   */
  public async findAll(query: string) {
    return await this._db
      .select({
        id: educationalResourceModel.id,
        title: educationalResourceModel.title,
        content: educationalResourceModel.content,
        authorEmail: educationalResourceModel.authorEmail,
        authorDocument: educationalResourceModel.authorDocument,
        createdAt: educationalResourceModel.createdAt,
        adminName: adminModel.fullName,
        specialistName: userModel.fullName
      })
      .from(educationalResourceModel)
      .leftJoin(adminModel, eq(adminModel.email, educationalResourceModel.authorEmail))
      .leftJoin(userModel, eq(userModel.document, educationalResourceModel.authorDocument))
      .where(
        or(
          like(educationalResourceModel.title, `%${query}%`),
          like(educationalResourceModel.content, `%${query}%`)
        )
      )
      .orderBy(desc(educationalResourceModel.createdAt))
  }

  /**
   * Get chat rooms with pagination support
   * @param limit Amount of chat rooms to show
   * @param offset Offset from start
   * @param query Search query
   */
  public async findWithLimitAndOffset(limit: number, offset: number, query: string) {
    return await this._db
      .select({
        id: educationalResourceModel.id,
        title: educationalResourceModel.title,
        content: educationalResourceModel.content,
        authorEmail: educationalResourceModel.authorEmail,
        authorDocument: educationalResourceModel.authorDocument,
        createdAt: educationalResourceModel.createdAt,
        adminName: adminModel.fullName,
        specialistName: userModel.fullName
      })
      .from(educationalResourceModel)
      .leftJoin(adminModel, eq(adminModel.email, educationalResourceModel.authorEmail))
      .leftJoin(userModel, eq(userModel.document, educationalResourceModel.authorDocument))
      .where(
        or(
          like(educationalResourceModel.title, `%${query}%`),
          like(educationalResourceModel.content, `%${query}%`)
        )
      )
      .orderBy(desc(educationalResourceModel.createdAt))
      .limit(limit)
      .offset(limit * offset)
  }

  public async findById(id: EducationalResource['id']) {
    const rows = await this._db
      .select({
        id: educationalResourceModel.id,
        title: educationalResourceModel.title,
        content: educationalResourceModel.content,
        authorEmail: educationalResourceModel.authorEmail,
        authorDocument: educationalResourceModel.authorDocument,
        createdAt: educationalResourceModel.createdAt,
        adminName: adminModel.fullName,
        specialistName: userModel.fullName
      })
      .from(educationalResourceModel)
      .leftJoin(adminModel, eq(adminModel.email, educationalResourceModel.authorEmail))
      .leftJoin(userModel, eq(userModel.document, educationalResourceModel.authorDocument))
      .where(eq(educationalResourceModel.id, id))

    return rows.at(0)
  }

  /**
   * Inserts an educational resource from an admin
   * @param newResource
   */
  public async createAdmin(newResource: NewResourceAdmin) {
    const rows = await this._db.insert(educationalResourceModel).values(newResource).returning({
      id: educationalResourceModel.id,
      title: educationalResourceModel.title,
      content: educationalResourceModel.content
    })

    return rows.at(0)
  }

  /**
   * Inserts an educational resource from an admin
   * @param newResource
   */
  public async createSpecialist(newResource: NewResourceSpecialist) {
    const rows = await this._db.insert(educationalResourceModel).values(newResource).returning({
      id: educationalResourceModel.id,
      title: educationalResourceModel.title,
      content: educationalResourceModel.content
    })

    return rows.at(0)
  }

  /**
   * Update an educational resource
   * @param id
   * @param patchedResource
   */
  public async updateResource(
    id: EducationalResource['id'],
    patchedResource: UpdateEducationalResourceDto
  ) {
    const rows = await this._db
      .update(educationalResourceModel)
      .set(patchedResource)
      .where(eq(educationalResourceModel.id, id))
      .returning({
        id: educationalResourceModel.id,
        title: educationalResourceModel.title,
        content: educationalResourceModel.content
      })

    return rows.at(0)
  }

  /**
   * Delete a resource
   * @param id ID of resource to delete
   */
  public async delete(id: EducationalResource['id']) {
    const rows = await this._db
      .delete(educationalResourceModel)
      .where(eq(educationalResourceModel.id, id))
      .returning({
        id: educationalResourceModel.id,
        title: educationalResourceModel.title
      })

    return rows.at(0)
  }
}
