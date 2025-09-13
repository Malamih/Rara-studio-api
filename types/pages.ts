type InputField = {
  type: 'input';
  value: string;
};

type IconField = {
  type: 'icon';
  value: string;
};

type TextareaField = {
  type: 'richtext';
  value: string;
};

type NumberField = {
  type: 'number';
  value: string;
};

type ImageField = {
  type: 'image';
  value: string;
};

type RichTextField = {
  type: 'richtext';
  value: string;
};

type ItemField<T> = {
  type: 'items';
  value: T[];
  maxValue: number | 'unlimited';
};

type ImagesField<T> = {
  type: 'images';
  value: T[];
  maxValue: number | 'unlimited';
};

export type HomePageContent = {
  name: 'home';
  sections: {
    hero: {
      tagline: InputField;
      subTitle: InputField;
      headline: InputField;
      subheadline: InputField;
      callToActionButton: RichTextField;
      image: ImageField;
    };
    about: {
      headline: InputField;
      subheadline: TextareaField;
    };
    overview: {
      happyClients: NumberField;
      professionalShots: NumberField;
      captivatingVideos: NumberField;
    };
    whyUs: {
      headline: InputField;
      subheadline: TextareaField;
    };
    companyOverview: {
      items: ItemField<{
        icon: IconField;
        title: InputField;
        caption: InputField;
      }>;
      expectedFields: string[];
    };
    packages: {
      headline: RichTextField;
      subheadline: TextareaField;
      images: {
        type: 'images';
        value: string[];
        maxValue: number | 'unlimited';
      };
    };
    coreValues: {
      items: ItemField<{
        title: InputField;
        caption: InputField;
      }>;
      expectedFields: string[];
    };
  };
};

export type AboutPageContent = {
  name: 'about';
  sections: {
    hero: {
      headline: InputField;
      subheadline: TextareaField;
      image: ImageField;
    };

    overview: {
      ourMissionTitle: InputField;
      ourMissionCaption: TextareaField;
      ourVisionTitle: InputField;
      ourVisionCaption: TextareaField;
      coreValuesTitle: InputField;
      coreValuesCaption: RichTextField;
      expectedFields: string[];
      images: ImagesField<string[]>;
      maxImages: number;
    };
    about: {
      headline: InputField;
      subheadline: TextareaField;
      items: ItemField<{ headline: string; subheadline: string; icon: string }>;
      expectedFields: string[];
      maxItems: 4;
    };
  };
};

export type ServicesPageContent = {
  name: 'services';
  sections: {
    hero: {
      headline: InputField;
      subheadline: TextareaField;
      image: ImageField;
    };
    services: {
      items: ItemField<{ title: string; caption: string; icon: string }>;
      expectedFields: string[];
      maxItems: 'unlimited';
    };
    callToAction: {
      title: RichTextField;
      caption: RichTextField;
    };
  };
};

export type PortfolioPageContent = {
  name: 'portfolio';
  sections: {
    hero: {
      headline: RichTextField;
    };
  };
};

export type ContactPageContent = {
  name: 'contact';
  sections: {
    contactInformation: {
      headline: InputField;
      subheadline: InputField;
      phoneNumber: InputField;
      email: InputField;
      location: InputField;
    };
    footer: {
      companyCaption: RichTextField;
      firstPhoneNumber: InputField;
      secondPhoneNumber: InputField;
      instagramLink: InputField;
      facebookLink: InputField;
      linkedinLink: InputField;
      location: InputField;
      email: InputField;
    };
  };
};

export type PageContent =
  | HomePageContent
  | AboutPageContent
  | ServicesPageContent
  | PortfolioPageContent
  | ContactPageContent;
