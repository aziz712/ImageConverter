import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('image') as File;
    const format = formData.get('format') as string;
    const quality = parseInt(formData.get('quality') as string) || 90;
    const width = formData.get('width') ? parseInt(formData.get('width') as string) : undefined;
    const height = formData.get('height') ? parseInt(formData.get('height') as string) : undefined;

    if (!file) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    if (!format) {
      return NextResponse.json({ error: 'No format specified' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    let image = sharp(buffer);

    if (width || height) {
      image = image.resize(width, height, {
        fit: 'inside',
        withoutEnlargement: true,
      });
    }

    let outputBuffer: Buffer;
    let mimeType: string;

    switch (format.toLowerCase()) {
      case 'jpg':
      case 'jpeg':
        outputBuffer = await image.jpeg({ quality }).toBuffer();
        mimeType = 'image/jpeg';
        break;
      case 'png':
        outputBuffer = await image.png({ quality }).toBuffer();
        mimeType = 'image/png';
        break;
      case 'webp':
        outputBuffer = await image.webp({ quality }).toBuffer();
        mimeType = 'image/webp';
        break;
      case 'avif':
        outputBuffer = await image.avif({ quality }).toBuffer();
        mimeType = 'image/avif';
        break;
      case 'tiff':
        outputBuffer = await image.tiff({ quality }).toBuffer();
        mimeType = 'image/tiff';
        break;
      case 'bmp':
        outputBuffer = await image.png().toBuffer();
        mimeType = 'image/bmp';
        break;
      case 'gif':
        outputBuffer = await image.png().toBuffer();
        mimeType = 'image/gif';
        break;
      default:
        return NextResponse.json({ error: 'Unsupported format' }, { status: 400 });
    }

    const originalName = file.name.split('.').slice(0, -1).join('.') || 'image';
    const filename = `${originalName}.${format}`;

    return new NextResponse(outputBuffer, {
      headers: {
        'Content-Type': mimeType,
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error('Conversion error:', error);
    return NextResponse.json(
      { error: 'Failed to convert image' },
      { status: 500 }
    );
  }
}
