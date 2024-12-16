import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'POST':
        const { userID, courseData }=req.body;
        if (!userID || !courseData) {
          return res.status(400).json({ error: 'User ID and Course Data are required' });
        }

        const { profid } = userID;
        const { 
          coursecode, 
          courseprefix, 
          coursetitle, 
          seatstaken, 
          capacity, 
          credits, 
          semester 
        } = courseData;
        const { data, error } = await supabase
          .from('course')
          .insert([
            {
              profid,
              coursecode,
              courseprefix,
              coursetitle,
              seatstaken,
              capacity,
              credits,
              semester,
            },
          ]);

        if (error) {
          console.error('Supabase insert error:', error);
          return res.status(500).json({ error: 'Failed to add course', details: error });
        }

        return res.status(201).json({ 
          message: 'Course added successfully', 
          course: data 
        });
      case 'GET':
        const { data: courses, error: fetchError } = await supabase
          .from('course')
          .select('*');

        if (fetchError) {
          console.error('Supabase fetch error:', fetchError);
          return res.status(500).json({ error: 'Failed to fetch courses', details: fetchError });
        }

        return res.status(200).json({ courses });

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('Unexpected error:', error);
    return res.status(500).json({ 
      error: 'Unexpected error occurred',
      details: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
}
