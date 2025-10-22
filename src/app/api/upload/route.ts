// app/api/upload/route.ts
import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Only image files are allowed' },
        { status: 400 }
      );
    }

    // Create a unique filename for the artwork
    const timestamp = Date.now();
    const extension = file.name.split('.').pop();
    const filename = `artwork-${timestamp}.${extension}`;

    // Upload to Vercel Blob storage
    const blob = await put(filename, file, { 
      access: 'public' 
    });

    console.log('File uploaded successfully to blob storage:', blob.url);

    return NextResponse.json({
      success: true,
      imageUrl: blob.url
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}