import React from "react";
//components
import HomeDetailsForm from 'components/Families/forms/HomeDetails'
import FamilyForm from 'components/Families/forms/Family'
import DescriptionFrom from 'components/Families/forms/Description'
import ReviewsForm from 'components/Families/forms/Reviews'
import ActivityForm from 'components/Families/forms/Activity'
import DocumentsForm from 'components/Families/forms/Documents'
import ContactForm from 'components/Families/forms/Contact'
import OthersForm from 'components/Families/forms/Others'
//PrimeReact
import { TabView, TabPanel } from "primereact/tabview";

export default function Tabs() {
    
  return (
    <TabView>
      <TabPanel header="Contact">
        <ContactForm/>
      </TabPanel>

      <TabPanel header="Home details">
        <HomeDetailsForm/>
      </TabPanel>

      <TabPanel header="Family">
        <FamilyForm/>
      </TabPanel>

      <TabPanel header="Description">
        <DescriptionFrom/>
      </TabPanel>

      <TabPanel header="Reviews">
        <ReviewsForm/>
      </TabPanel>

      <TabPanel header="Activity">
        <ActivityForm/>
      </TabPanel>
      
      <TabPanel header="Documents">
        <DocumentsForm/>
      </TabPanel>

      <TabPanel header="Search">
        <OthersForm/>
      </TabPanel>
    </TabView>
  );
}
