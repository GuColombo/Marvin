import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';
import pptxgen from 'pptxgenjs';
import * as XLSX from 'xlsx';
import { Framework } from './frameworkRegistry';
import { BrandAssets } from './templateManager';

export async function generateWordDocument(
  framework: Framework,
  tokens: Record<string, string>,
  branding: BrandAssets
): Promise<Blob> {
  const doc = new Document({
    styles: {
      default: {
        heading1: {
          run: {
            size: 32,
            bold: true,
            color: branding.colors.primary.replace('#', ''),
          },
          paragraph: {
            spacing: { after: 400 },
          },
        },
        heading2: {
          run: {
            size: 28,
            bold: true,
            color: branding.colors.secondary.replace('#', ''),
          },
          paragraph: {
            spacing: { before: 400, after: 200 },
          },
        },
      },
    },
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: tokens['project.name'] || framework.name,
                bold: true,
                size: 36,
                color: branding.colors.primary.replace('#', ''),
              }),
            ],
            heading: HeadingLevel.TITLE,
            alignment: AlignmentType.CENTER,
          }),
          
          new Paragraph({
            children: [
              new TextRun({
                text: `Strategic Analysis using ${framework.name}`,
                size: 24,
                color: branding.colors.secondary.replace('#', ''),
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
          }),
          
          new Paragraph({
            children: [
              new TextRun({
                text: `Date: ${tokens.date}`,
                size: 20,
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 800 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: 'Executive Summary',
                bold: true,
                size: 28,
              }),
            ],
            heading: HeadingLevel.HEADING_1,
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: `This analysis applies the ${framework.name} framework to ${tokens['project.name'] || 'the strategic challenge'}. ${framework.description}`,
              }),
            ],
            spacing: { after: 400 },
          }),

          ...framework.outputSections.map(section => [
            new Paragraph({
              children: [
                new TextRun({
                  text: section.title,
                  bold: true,
                  size: 24,
                }),
              ],
              heading: HeadingLevel.HEADING_2,
            }),
            
            new Paragraph({
              children: [
                new TextRun({
                  text: section.description,
                }),
              ],
              spacing: { after: 200 },
            }),
            
            new Paragraph({
              children: [
                new TextRun({
                  text: generateSectionContent(section.id, tokens, framework),
                }),
              ],
              spacing: { after: 400 },
            }),
          ]).flat(),

          new Paragraph({
            children: [
              new TextRun({
                text: 'Next Steps & Recommendations',
                bold: true,
                size: 24,
              }),
            ],
            heading: HeadingLevel.HEADING_2,
          }),

          ...framework.recommendedSteps.map((step, index) => 
            new Paragraph({
              children: [
                new TextRun({
                  text: `${index + 1}. ${step}`,
                }),
              ],
              spacing: { after: 200 },
            })
          ),
        ],
      },
    ],
  });

  return await Packer.toBlob(doc);
}

export async function generatePowerPointDocument(
  framework: Framework,
  tokens: Record<string, string>,
  branding: BrandAssets
): Promise<Blob> {
  const pptx = new pptxgen();
  
  pptx.defineLayout({ name: 'A4', width: 10, height: 7.5 });
  pptx.layout = 'A4';

  const titleSlide = pptx.addSlide();
  titleSlide.background = { fill: branding.colors.background };
  
  titleSlide.addText(tokens['project.name'] || framework.name, {
    x: 1,
    y: 2,
    w: 8,
    h: 1.5,
    fontSize: 36,
    bold: true,
    color: branding.colors.primary,
    align: 'center',
  });
  
  titleSlide.addText(`Strategic Analysis using ${framework.name}`, {
    x: 1,
    y: 3.5,
    w: 8,
    h: 1,
    fontSize: 24,
    color: branding.colors.secondary,
    align: 'center',
  });
  
  titleSlide.addText(`Date: ${tokens.date}`, {
    x: 1,
    y: 5,
    w: 8,
    h: 0.5,
    fontSize: 18,
    align: 'center',
  });

  const agendaSlide = pptx.addSlide();
  agendaSlide.addText('Agenda', {
    x: 1,
    y: 0.5,
    w: 8,
    h: 1,
    fontSize: 32,
    bold: true,
    color: branding.colors.primary,
  });
  
  const agendaItems = [
    'Executive Summary',
    ...framework.outputSections.map(s => s.title),
    'Next Steps & Recommendations'
  ];
  
  agendaItems.forEach((item, index) => {
    agendaSlide.addText(`${index + 1}. ${item}`, {
      x: 1.5,
      y: 2 + (index * 0.6),
      w: 7,
      h: 0.5,
      fontSize: 20,
    });
  });

  framework.outputSections.forEach((section, index) => {
    const slide = pptx.addSlide();
    
    slide.addText(section.title, {
      x: 1,
      y: 0.5,
      w: 8,
      h: 1,
      fontSize: 32,
      bold: true,
      color: branding.colors.primary,
    });
    
    slide.addText(section.description, {
      x: 1,
      y: 1.5,
      w: 8,
      h: 1,
      fontSize: 18,
      color: branding.colors.secondary,
    });
    
    const content = generateSectionContent(section.id, tokens, framework);
    slide.addText(content, {
      x: 1,
      y: 2.5,
      w: 8,
      h: 4,
      fontSize: 16,
      valign: 'top',
    });
  });

  const nextStepsSlide = pptx.addSlide();
  nextStepsSlide.addText('Next Steps & Recommendations', {
    x: 1,
    y: 0.5,
    w: 8,
    h: 1,
    fontSize: 32,
    bold: true,
    color: branding.colors.primary,
  });
  
  framework.recommendedSteps.forEach((step, index) => {
    nextStepsSlide.addText(`${index + 1}. ${step}`, {
      x: 1.5,
      y: 2 + (index * 0.6),
      w: 7,
      h: 0.5,
      fontSize: 18,
    });
  });

  return pptx.write() as Promise<Blob>;
}

export async function generateExcelDocument(
  framework: Framework,
  tokens: Record<string, string>,
  branding: BrandAssets
): Promise<Blob> {
  const wb = XLSX.utils.book_new();
  
  const summaryData = [
    ['Strategic Analysis Report', '', '', ''],
    ['Framework:', framework.name, '', ''],
    ['Project:', tokens['project.name'] || 'Strategic Analysis', '', ''],
    ['Date:', tokens.date, '', ''],
    ['', '', '', ''],
    ['Section', 'Description', 'Status', 'Notes'],
    ...framework.outputSections.map(section => [
      section.title,
      section.description,
      'Pending',
      ''
    ])
  ];
  
  const summaryWs = XLSX.utils.aoa_to_sheet(summaryData);
  
  summaryWs['!cols'] = [
    { width: 25 },
    { width: 40 },
    { width: 15 },
    { width: 30 }
  ];
  
  XLSX.utils.book_append_sheet(wb, summaryWs, 'Summary');

  const analysisData = [
    ['Analysis Framework: ' + framework.name],
    [''],
    ['Input Parameters:'],
    ...framework.inputPrompts.map(prompt => [
      prompt.label + ':',
      tokens[prompt.id] || 'Not provided'
    ]),
    [''],
    ['Output Sections:'],
    ...framework.outputSections.map(section => [
      section.title,
      generateSectionContent(section.id, tokens, framework)
    ])
  ];
  
  const analysisWs = XLSX.utils.aoa_to_sheet(analysisData);
  analysisWs['!cols'] = [
    { width: 25 },
    { width: 60 }
  ];
  
  XLSX.utils.book_append_sheet(wb, analysisWs, 'Analysis');

  if (framework.id === 'bcg-matrix' || framework.id.includes('financial')) {
    const financialData = [
      ['Financial Model Template'],
      [''],
      ['Assumptions', 'Value', 'Notes'],
      ['Revenue Growth Rate', '10%', 'Annual growth assumption'],
      ['Cost Inflation', '3%', 'Annual cost increase'],
      ['Market Size', '1000000', 'Total addressable market'],
      ['Market Share', '5%', 'Target market share'],
      [''],
      ['Projections', 'Year 1', 'Year 2', 'Year 3'],
      ['Revenue', '=D4*D5', '=E9*1.1', '=F9*1.1'],
      ['Costs', '=E9*0.7', '=F9*0.72', '=G9*0.74'],
      ['Profit', '=E9-E10', '=F9-F10', '=G9-G10']
    ];
    
    const financialWs = XLSX.utils.aoa_to_sheet(financialData);
    financialWs['!cols'] = [
      { width: 20 },
      { width: 15 },
      { width: 15 },
      { width: 15 }
    ];
    
    XLSX.utils.book_append_sheet(wb, financialWs, 'Financial Model');
  }

  const nextStepsData = [
    ['Next Steps & Action Plan'],
    [''],
    ['Step', 'Description', 'Owner', 'Due Date', 'Status'],
    ...framework.recommendedSteps.map((step, index) => [
      index + 1,
      step,
      'TBD',
      'TBD',
      'Not Started'
    ])
  ];
  
  const nextStepsWs = XLSX.utils.aoa_to_sheet(nextStepsData);
  nextStepsWs['!cols'] = [
    { width: 8 },
    { width: 40 },
    { width: 15 },
    { width: 12 },
    { width: 15 }
  ];
  
  XLSX.utils.book_append_sheet(wb, nextStepsWs, 'Action Plan');

  const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  return new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
}

function generateSectionContent(sectionId: string, tokens: Record<string, string>, framework: Framework): string {
  const contextualContent: Record<string, string> = {
    'structure': `Problem Structure Analysis:\n\nBased on the MECE framework, the key problem areas have been identified and structured to ensure comprehensive coverage without overlap.\n\nKey Categories:\n• ${tokens['problem'] || 'Strategic challenge'}\n• Stakeholder considerations: ${tokens['stakeholders'] || 'Various stakeholders'}\n• Scope: ${tokens['scope'] || 'Defined scope'}`,
    
    'analysis': `Detailed Analysis:\n\nThis section provides in-depth analysis of each identified category, leveraging the ${framework.name} methodology.\n\nKey Findings:\n• Analysis reveals critical success factors\n• Risk assessment indicates manageable challenges\n• Opportunity identification suggests significant potential`,
    
    'forces-analysis': `Five Forces Analysis:\n\nIndustry: ${tokens['industry'] || 'Target industry'}\nTimeframe: ${tokens['timeframe'] || 'Current analysis'}\n\n1. Threat of New Entrants: Moderate\n2. Bargaining Power of Suppliers: Low to Moderate\n3. Bargaining Power of Buyers: Moderate to High\n4. Threat of Substitutes: Low\n5. Competitive Rivalry: High`,
    
    'swot-matrix': `SWOT Analysis Matrix:\n\nStrengths:\n• Core competencies\n• Market position\n• Resource advantages\n\nWeaknesses:\n• Areas for improvement\n• Resource constraints\n• Capability gaps\n\nOpportunities:\n• Market trends\n• Regulatory changes\n• Technology advances\n\nThreats:\n• Competitive pressure\n• Market volatility\n• External risks`,
    
    'current-state': `Current State Assessment:\n\nUsing the McKinsey 7S framework, the current organizational state has been evaluated across all seven elements:\n\nStrategy: ${tokens['change-context'] || 'Current strategic direction'}\nStructure: Existing organizational design\nSystems: Current processes and procedures\nShared Values: Cultural foundation\nStyle: Leadership approach\nStaff: Human resources\nSkills: Capabilities and competencies`,
    
    'recommendations': `Strategic Recommendations:\n\nBased on the analysis using ${framework.name}, the following recommendations are proposed:\n\n1. Prioritize high-impact initiatives\n2. Address identified capability gaps\n3. Leverage competitive advantages\n4. Mitigate key risks\n5. Implement phased approach`,
    
    'action-plan': `Implementation Action Plan:\n\nPhase 1: Foundation (Months 1-3)\n• Establish governance structure\n• Secure resources\n• Build stakeholder alignment\n\nPhase 2: Execution (Months 4-9)\n• Implement core initiatives\n• Monitor progress\n• Adjust strategy as needed\n\nPhase 3: Optimization (Months 10-12)\n• Fine-tune approach\n• Capture lessons learned\n• Plan next phase`,
  };

  return contextualContent[sectionId] || `Analysis for ${sectionId}:\n\nThis section contains detailed analysis based on the ${framework.name} framework. The analysis incorporates the provided inputs and applies the framework methodology to generate strategic insights and recommendations.\n\nKey considerations include the project context: ${tokens['project.name'] || 'Strategic initiative'} and the specific requirements outlined in the framework inputs.`;
}