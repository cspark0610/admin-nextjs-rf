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
      <TabPanel header="Home details">
        <h1>Home details</h1>
        <HomeDetailsForm/>
      </TabPanel>

      <TabPanel header="Family">
        <FamilyForm/>
      </TabPanel>

      <TabPanel header="Description">
        <h1>Description</h1>
        <DescriptionFrom/>
      </TabPanel>

      <TabPanel header="Reviews">
        <ReviewsForm/>
      </TabPanel>

      <TabPanel header="Activity">
        <h1>Activity</h1>
        <ActivityForm/>
      </TabPanel>
      
      <TabPanel header="Documents">
        <DocumentsForm/>
      </TabPanel>

      <TabPanel header="Contact">
        <h1>Contact</h1>
        <ContactForm/>
      </TabPanel>

      <TabPanel header="Others">
        <OthersForm/>
      </TabPanel>
    </TabView>
  );
}
