// pages.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ strict: false }) // allow flexible nested fields
export class Page extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ type: Object, default: {} })
  sections: Record<string, any>;
}

export const PageSchema = SchemaFactory.createForClass(Page);
