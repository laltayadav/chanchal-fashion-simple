import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: 'Products API placeholder' });
}

export async function POST() {
  return NextResponse.json({ message: 'Products API placeholder' }, { status: 201 });
}
