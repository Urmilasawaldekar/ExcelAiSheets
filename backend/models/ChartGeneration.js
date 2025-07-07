import mongoose from 'mongoose';

const chartGenerationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'UserModel', required: true },
  chartType: { type: String, required: true },
  generatedAt: { type: Date, default: Date.now },
});

const ChartGeneration = mongoose.model('ChartGeneration', chartGenerationSchema);

export default ChartGeneration;
