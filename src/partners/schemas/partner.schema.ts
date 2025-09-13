import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PartnerDocument = Partner & Document;

@Schema({ timestamps: true })
export class Partner {
  @Prop({ type: String, required: true, unique: true, index: true })
  name: string;
  @Prop({
    type: {
      public_id: { type: String, required: true },
      secure_url: { type: String, required: true },
    },
    required: true,
  })
  logo: {
    public_id: string;
    secure_url: string;
  };
}

export const PartnerSchema = SchemaFactory.createForClass(Partner);

PartnerSchema.virtual('portfolios', {
  ref: 'Portfolio',
  localField: '_id',
  foreignField: 'client',
  justOne: false,
});
