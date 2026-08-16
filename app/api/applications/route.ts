import { NextResponse } from 'next/server';
import { APPLICATIONS_STORE, ApplicationRecord } from '@/lib/applicationsStore';

// GET: Dashboard fetches all applications
export async function GET() {
  return NextResponse.json(APPLICATIONS_STORE);
}

// POST: Career forms submit new applications
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { applicantName, position, email, phone, experience, notes } = body;

    if (!applicantName || !position || !email) {
      return NextResponse.json(
        { message: 'Missing required application fields.' },
        { status: 400 }
      );
    }

    const newApplication: ApplicationRecord = {
      id: `APP-${Math.floor(1000 + Math.random() * 9000)}`,
      applicantName,
      position,
      submittedDate: new Date().toISOString().split('T')[0],
      status: 'Pending',
      email,
      phone: phone || 'N/A',
      experience: experience || 'Not specified',
      notes: notes || 'Submitted via online portal.',
    };

    APPLICATIONS_STORE.unshift(newApplication);

    return NextResponse.json({ success: true, application: newApplication });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to submit application.' }, { status: 500 });
  }
}
