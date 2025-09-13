import { Schema } from '@nestjs/mongoose';

@Schema({
  timestamps: true,
})
export class Work {
  title: string;
  caption: string;
  type: 'videography' | 'photography';
  client: {
    public_id: string;
    url: string;
  };
  projectDate: string;
}
