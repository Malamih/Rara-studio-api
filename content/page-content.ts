import { PageContent } from 'types/pages';

export const pagesContent: PageContent[] = [
  {
    name: 'home',
    sections: {
      hero: {
        tagline: { type: 'input', value: '' },
        subTitle: { type: 'input', value: '' },
        headline: { type: 'input', value: '' },
        subheadline: { type: 'input', value: '' },
        callToActionButton: { type: 'richtext', value: '' },
        image: { type: 'image', value: '' },
      },
      about: {
        headline: { type: 'input', value: '' },
        subheadline: { type: 'richtext', value: '' },
      },
      overview: {
        happyClients: { type: 'number', value: '' },
        professionalShots: { type: 'number', value: '' },
        captivatingVideos: { type: 'number', value: '' },
      },
      whyUs: {
        headline: { type: 'input', value: '' },
        subheadline: { type: 'richtext', value: '' },
      },
      companyOverview: {
        items: {
          type: 'items',
          value: [],
          maxValue: 6,
        },
        expectedFields: ['title', 'icon', 'caption'],
      },
      packages: {
        headline: { type: 'richtext', value: '' },
        subheadline: { type: 'richtext', value: '' },
        images: {
          type: 'images',
          value: [],
          maxValue: 'unlimited',
        },
      },
      coreValues: {
        items: {
          type: 'items',
          value: [],
          maxValue: 4,
        },
        expectedFields: ['title', 'caption'],
      },
    },
  },
  {
    name: 'about',
    sections: {
      hero: {
        headline: { type: 'input', value: '' },
        subheadline: { type: 'richtext', value: '' },
        image: { type: 'image', value: '' },
      },
      overview: {
        ourMissionTitle: { type: 'input', value: '' },
        ourMissionCaption: { type: 'richtext', value: '' },
        ourVisionTitle: { type: 'input', value: '' },
        ourVisionCaption: { type: 'richtext', value: '' },
        coreValuesTitle: { type: 'input', value: '' },
        coreValuesCaption: { type: 'richtext', value: '' },
        expectedFields: ['caption'],
        images: {
          type: 'images',
          value: [],
          maxValue: 4,
        },
        maxImages: 6,
      },
      about: {
        headline: { type: 'input', value: '' },
        subheadline: { type: 'richtext', value: '' },
        items: {
          type: 'items',
          value: [],
          maxValue: 4,
        },
        expectedFields: ['title', 'icon', 'caption'],
        maxItems: 4,
      },
    },
  },
  {
    name: 'services',
    sections: {
      hero: {
        headline: { type: 'input', value: '' },
        subheadline: { type: 'richtext', value: '' },
        image: { type: 'image', value: '' },
      },
      services: {
        maxItems: 'unlimited',
        items: {
          type: 'items',
          value: [],
          maxValue: 'unlimited',
        },
        expectedFields: ['title', 'icon', 'caption'],
      },
      callToAction: {
        title: { type: 'richtext', value: '' },
        caption: { type: 'richtext', value: '' },
      },
    },
  },
  {
    name: 'portfolio',
    sections: {
      hero: {
        headline: { type: 'richtext', value: '' },
      },
    },
  },
  {
    name: 'contact',
    sections: {
      contactInformation: {
        headline: { type: 'input', value: '' },
        subheadline: { type: 'input', value: '' },
        phoneNumber: { type: 'input', value: '' },
        email: { type: 'input', value: '' },
        location: { type: 'input', value: '' },
      },
      footer: {
        companyCaption: { type: 'richtext', value: '' },
        location: { type: 'input', value: '' },
        email: { type: 'input', value: '' },
        firstPhoneNumber: { type: 'input', value: '' },
        secondPhoneNumber: { type: 'input', value: '' },
        facebookLink: { type: 'input', value: '' },
        instagramLink: { type: 'input', value: '' },
        linkedinLink: { type: 'input', value: '' },
      },
    },
  },
];
