import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Portfolio {
  @Prop({ required: true, type: String })
  name: string;
  @Prop({
    required: false,
    type: {
      public_id: { type: String, required: true },
      url: { type: String, required: true },
    },
  })
  image: {
    public_id: string;
    url: string;
  };
  @Prop({
    required: false,
    type: {
      public_id: { type: String, required: true },
      url: { type: String, required: true },
    },
  })
  logo: {
    public_id: string;
    url: string;
  };
  @Prop({
    required: false,
    type: {
      public_id: { type: String, required: true },
      url: { type: String, required: true },
    },
  })
  banner: {
    public_id: string;
    url: string;
  };
  @Prop({ required: false, type: String })
  insight: string;
  @Prop({ required: false, type: String })
  description: string;
  @Prop({ required: true, type: Types.ObjectId, ref: 'Partner' })
  client: Types.ObjectId;
  @Prop({ required: false, type: String })
  projectDate: string;
  @Prop({ required: false, Type: Boolean, default: false })
  isSelected: boolean;
}

export const PortfolioSchema = SchemaFactory.createForClass(Portfolio);

PortfolioSchema.virtual('photography', {
  ref: 'Photography',
  localField: '_id',
  foreignField: 'portfolio',
  justOne: false,
});

PortfolioSchema.virtual('videography', {
  ref: 'Videography',
  localField: '_id',
  foreignField: 'portfolio',
  justOne: false,
});
