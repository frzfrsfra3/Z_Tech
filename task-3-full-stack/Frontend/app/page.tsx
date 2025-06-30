import React from "react";

import Header from '@/components/Header'; // Adjust path based on your project structure

import Footer from '@/components/Footer';

import Content from '@/components/Content';
const HomePage: React.FC = () => {
  return (
    <div>
         <Header />
    
    <Content/>


    <Footer />
      
    </div>
  );
};

export default HomePage;
