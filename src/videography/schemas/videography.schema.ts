import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({
  timestamps: true,
})
export class Videography {
  @Prop({ required: true, Type: String })
  title: string;
  @Prop({ type: Types.ObjectId, ref: 'Portfolio', required: true })
  portfolio: Types.ObjectId;
  @Prop({ required: true, Type: String })
  video: string;
  @Prop({ required: true, Type: String })
  thumbnail: string;
}

export const VideographySchema = SchemaFactory.createForClass(Videography);
