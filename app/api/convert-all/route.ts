import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';
import JSZip from 'jszip';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('images') as File[];
    const format = formData.get('format') as string;
    const quality = parseInt(formData.get('quality') as string) || 90;
    const width = formData.get('width') ? parseInt(formData.get('width') as string) : undefined;
    const height = formData.get('height') ? parseInt(formData.get('height') as string) : undefined;
    const preserveExif = formData.get('preserveExif') === 'true';

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No images provided' }, { status: 400 });
    }

    if (!format) {
      return NextResponse.json({ error: 'No format specified' }, { status: 400 });
    }

    // Create a new ZIP file
    const zip = new JSZip();

    // Process each image and add to ZIP
    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer());
      let image = sharp(buffer);

      // Resize if dimensions provided
      if (width || height) {
        image = image.resize(width, height, {
          fit: 'inside',
          withoutEnlargement: true,
        });
      }

      // Remove EXIF data if not preserving
      if (!preserveExif) {
        image = image.withMetadata({ exif: {} });
      }

      let outputBuffer: Buffer;

      switch (format.toLowerCase()) {
        case 'jpg':
        case 'jpeg':
          outputBuffer = await image.jpeg({ quality }).toBuffer();
          break;
        case 'png':
          outputBuffer = await image.png({ quality }).toBuffer();
          break;
        case 'webp':
          outputBuffer = await image.webp({ quality }).toBuffer();
          break;
        case 'avif':
          outputBuffer = await image.avif({ quality }).toBuffer();
          break;
        case 'tiff':
          outputBuffer = await image.tiff({ quality }).toBuffer();
          break;
        case 'bmp':
          // BMP output is not directly supported by Sharp; skip conversion
          return NextResponse.json({ error: 'BMP format is not supported' }, { status: 400 });
          break;
        case 'gif':
          outputBuffer = await image.gif().toBuffer();
          break;
        default:
          return NextResponse.json({ error: 'Unsupported format' }, { status: 400 });
      }

      // Get original filename without extension
      const originalName = file.name.split('.').slice(0, -1).join('.') || 'image';
      const filename = `${originalName}.${format}`;

      // Add the converted image to the ZIP (Buffer is a Uint8Array)
      zip.file(filename, outputBuffer);
    }

    // Generate the ZIP file
    const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });

    // Return the ZIP file
    return new NextResponse(zipBuffer, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="converted_images.zip"`,
      },
    });
  } catch (error) {
    console.error('Batch conversion error:', error);
    return NextResponse.json(
      { error: 'Failed to convert images' },
      { status: 500 }
    );
  }
}