import { LegalCategory, LegalContent } from './types';

export const LEGAL_CATEGORIES: LegalCategory[] = [
  {
    id: 'tenant',
    title: 'Tenant Rights',
    description: 'Housing and rental rights',
    icon: '🏠',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    id: 'employment',
    title: 'Employment Rights',
    description: 'Workplace and labor rights',
    icon: '💼',
    color: 'from-green-500 to-emerald-500',
  },
  {
    id: 'consumer',
    title: 'Consumer Rights',
    description: 'Shopping and service rights',
    icon: '🛒',
    color: 'from-purple-500 to-pink-500',
  },
  {
    id: 'traffic',
    title: 'Traffic Rights',
    description: 'Traffic stops and violations',
    icon: '🚗',
    color: 'from-orange-500 to-red-500',
  },
  {
    id: 'arrests',
    title: 'Arrest Rights',
    description: 'Rights during arrests',
    icon: '⚖️',
    color: 'from-indigo-500 to-blue-500',
  },
];

export const SAMPLE_LEGAL_CONTENT: LegalContent[] = [
  {
    id: 'tenant-eviction-rights',
    title: 'Rights During Eviction',
    contentType: 'card',
    category: 'tenant',
    content: `**Your Rights During Eviction:**

• **Proper Notice Required**: Landlords must provide written notice (typically 30-60 days depending on your state)
• **Right to Contest**: You can challenge the eviction in court
• **Right to Repairs**: Landlords cannot evict for requesting necessary repairs
• **No Self-Help Evictions**: Landlords cannot change locks, shut off utilities, or remove your belongings
• **Right to Legal Representation**: You have the right to an attorney in eviction proceedings

**Immediate Steps:**
1. Document everything in writing
2. Know your state's specific notice requirements
3. Seek legal aid if needed
4. Respond to court papers promptly`,
    price: 50, // 50 cents
  },
  {
    id: 'employment-wage-rights',
    title: 'Wage and Hour Rights',
    contentType: 'card',
    category: 'employment',
    content: `**Your Wage Rights:**

• **Minimum Wage**: You must be paid at least federal/state minimum wage
• **Overtime Pay**: Time-and-a-half for hours over 40 per week (most employees)
• **Meal Breaks**: Required break periods vary by state
• **Final Paycheck**: Must receive final pay by specific deadlines
• **Wage Theft Protection**: Employers cannot illegally withhold wages

**Red Flags:**
- Being paid below minimum wage
- Not receiving overtime when eligible
- Deductions that bring pay below minimum wage
- Late or missing paychecks

**Next Steps:**
1. Keep detailed records of hours worked
2. File complaint with Department of Labor
3. Contact your state's wage and hour division`,
    price: 50,
  },
  {
    id: 'traffic-stop-rights',
    title: 'Traffic Stop Rights',
    contentType: 'card',
    category: 'traffic',
    content: `**During a Traffic Stop:**

• **Right to Remain Silent**: You don't have to answer questions beyond providing ID
• **Right to Refuse Searches**: You can refuse consent to search your vehicle
• **Right to Record**: You can record the interaction (check local laws)
• **Right to Ask if Free to Leave**: You can ask if you're being detained

**What to Do:**
1. Pull over safely and turn off engine
2. Keep hands visible
3. Provide license, registration, insurance when asked
4. Stay calm and polite
5. Don't argue - save it for court

**What NOT to Do:**
- Don't reach for documents until asked
- Don't get out unless instructed
- Don't consent to searches
- Don't admit guilt`,
    price: 50,
  },
  {
    id: 'arrest-rights',
    title: 'Rights During Arrest',
    contentType: 'card',
    category: 'arrests',
    content: `**Your Miranda Rights:**

• **Right to Remain Silent**: Anything you say can be used against you
• **Right to an Attorney**: You have the right to legal representation
• **Right to Have Attorney Present**: During questioning
• **Right to Appointed Attorney**: If you cannot afford one

**During Arrest:**
1. Stay calm and don't resist
2. Clearly state: "I invoke my right to remain silent"
3. Ask for a lawyer immediately
4. Don't sign anything without legal counsel
5. Remember details for your attorney

**Important:**
- Police must read Miranda rights before interrogation
- You can invoke these rights at any time
- Invoking rights cannot be used against you in court`,
    price: 50,
  },
  {
    id: 'consumer-return-rights',
    title: 'Return and Refund Rights',
    contentType: 'card',
    category: 'consumer',
    content: `**Consumer Return Rights:**

• **Cooling-Off Period**: 3-day right to cancel certain contracts
• **Defective Products**: Right to refund or replacement for defective items
• **Online Purchases**: Many states require return policies to be clearly posted
• **Credit Card Protection**: Dispute charges for defective or undelivered goods

**Types of Returns:**
- **Store Policy Returns**: Based on individual store policies
- **Warranty Returns**: Manufacturer defects and malfunctions
- **Legal Returns**: Required by law (door-to-door sales, etc.)

**Steps for Returns:**
1. Check store return policy first
2. Keep all receipts and documentation
3. Contact customer service
4. File complaint with Better Business Bureau if needed
5. Dispute credit card charges if applicable`,
    price: 50,
  },
];

export const DOCUMENT_TEMPLATES = [
  {
    id: 'demand-letter-rent',
    title: 'Demand Letter for Unpaid Rent',
    category: 'tenant',
    price: 100, // $1.00
    fields: ['landlordName', 'landlordAddress', 'tenantName', 'propertyAddress', 'rentAmount', 'dueDate'],
  },
  {
    id: 'workplace-complaint',
    title: 'Formal Workplace Complaint',
    category: 'employment',
    price: 100,
    fields: ['employerName', 'supervisorName', 'employeeName', 'incidentDate', 'description'],
  },
  {
    id: 'consumer-complaint',
    title: 'Consumer Complaint Letter',
    category: 'consumer',
    price: 100,
    fields: ['companyName', 'productService', 'purchaseDate', 'issueDescription', 'desiredResolution'],
  },
];
