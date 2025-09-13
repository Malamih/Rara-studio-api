import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  timestamps: true,
})
export class Employee {
  @Prop({ required: true })
  name: string;
  @Prop({ required: true })
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

  @Prop({ type: String, required: true })
  caption: string;
  @Prop({ type: String, required: false })
  facebook: string;
  @Prop({ type: String, required: false })
  github: string;
  @Prop({ type: String, required: false })
  linkedin: string;
}

export const employeeSchema = SchemaFactory.createForClass(Employee);
