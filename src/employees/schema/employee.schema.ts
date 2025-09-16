import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  timestamps: true,
})
export class Employee {
  @Prop({ required: true })
  name: string;
  @Prop({ required: false })
  position: string;
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

  @Prop({ type: String, required: false })
  caption: string;
  @Prop({ type: String, required: false })
  facebook: string;
  @Prop({ type: String, required: false })
  github: string;
  @Prop({ type: String, required: false })
  linkedin: string;
  @Prop({ type: Number, required: false })
  order: number;
}

export const employeeSchema = SchemaFactory.createForClass(Employee);
