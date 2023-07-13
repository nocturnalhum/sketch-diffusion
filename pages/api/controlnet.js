import Replicate from 'replicate';

const handler = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method not allowed.' });
    return;
  }

  if (!process.env.REPLICATE_API_TOKEN) {
    throw new Error('The REPLICATE_API_TOKEN environment variable is not set.');
  }

  const { value, img } = req.body;

  try {
    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });
    console.log('REQ', req.body);
    const output = await replicate.run(
      'jagilley/controlnet-scribble:435061a1b5a4c1e26740464bf786efdfa9cb3a3ac488595a2de23e143fdb0117',
      {
        input: {
          image: 'https://i.postimg.cc/6pmtZy7j/cat.png',
          prompt: value,
          // image_dimensions: '512x512',
          // num_inference_steps: 12,
          // num_outputs: 1,
          // guideance_scale: 3.5,
          // scheduler: 'K_EULER',
        },
      }
    );
    console.log('Output', output);
    res.status(200).json(output);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};

export default handler;
