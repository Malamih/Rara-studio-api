import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Photography extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({
    required: true,
    type: {
      public_id: { type: String, required: true },
      url: { type: String, required: true },
    },
  })
  image: {
    public_id: string;
    url: string;
  };
  @Prop({ type: Types.ObjectId, ref: 'Portfolio', required: true })
  portfolio: Types.ObjectId;
}

export const PhotographySchema = SchemaFactory.createForClass(Photography);
