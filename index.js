import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';

const app = express();
app.use(express.json());
app.use(cors());

// ربط قاعدة بيانات سوبابيز الخاصة بكِ
const supabase = createClient(process.env.SUPABASE_URL || '', process.env.SUPABASE_KEY || '');

app.post('/api/classify', async (req, res) => {
  // استقبال الرمز السري من الـ Body Parameters لسهولة إدخاله في n8n بالجوال
  const secretToken = req.body['X-Etizan-Secret'];
  const expectedSecret = process.env.ETIZAN_SECRET;

  if (!secretToken || secretToken !== expectedSecret) {
    return res.status(401).json({ error: 'رمز الأمان خاطئ أو غير مفرز' });
  }

  const { message } = req.body; // الرسالة القادمة من الواتساب عبر n8n
  
  try {
    // السيرفر سيرد فوراً بالنجاح لتأكيد استقبال الرسالة من n8n والواتساب
    return res.json({ 
      status: 'success', 
      message: 'تم استقبال بيانات اتزان وجاري معالجتها وحقنها بنجاح!' 
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`السيرفر يعمل بنجاح على بورت ${PORT}`));
