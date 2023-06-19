import React, { useContext, useState, useEffect } from "react";
import PetContext from "../context/petsContextProvider";
import Filters from "../components/Filters";
import PetList from "../components/PetList";
import { motion } from "framer-motion";
const PetSearch = () => {
  const { allpets, loading } = useContext(PetContext);
  const [filteredPets, setFilteredPets] = useState([]);

  useEffect(() => {
    setFilteredPets(allpets);
  }, [allpets]);
  // let datepet= (allpets[0].createdAt)
 

  const [filterCriteria, setFilterCriteria] = useState({
    age: "",
    gender: "",
    sterilized: "",
    vaccinated: "",
    color: "",
    goodWith: "",
    daysOnSite: "",
    size: "",
    type: "",
    city:'',
  });
  console.log(filterCriteria);
  const resetFilters = () => {
    setFilterCriteria({
      age: "",
      gender: "",
      sterilized: "",
      vaccinated: "",
      color: "",
      goodWith: "",
      daysOnSite: "",
      size: "",
      type: "",
      city: "",
    });
  };
  let datepet = allpets.map((date) => date.createdAt);
  // console.log(datepet[0]);

  let updatedpet = datepet.map((PetDate) =>
    Math.ceil(Math.abs(new Date() - new Date(PetDate)) / (1000 * 60 * 60 * 24))
  );
  console.log(`Days on the ${updatedpet} days.`);

  const dateFunc = (dates) => {
    let finaldate = {};
    dates.forEach((date, index) => {
      if (
        (filterCriteria.daysOnSite === "week" && date <= 7) ||
        (filterCriteria.daysOnSite === "month" && date > 30) ||
        filterCriteria.daysOnSite === ""
      ) {
        finaldate[allpets[index]._id] = date;
      }
    });
    return finaldate;
  };
  console.log(dateFunc(updatedpet));

  const applyFilters = () => {
    const filtered = allpets.filter((pet) => {
      const daysOnSiteData = dateFunc(updatedpet);

      return (
        daysOnSiteData.hasOwnProperty(pet._id) &&
        (filterCriteria.age === "" || pet.age === filterCriteria.age) &&
        (filterCriteria.gender === "" ||
          pet.gender === filterCriteria.gender) &&
        (filterCriteria.sterilized === "" ||
          pet.sterilized === filterCriteria.sterilized) &&
        (filterCriteria.vaccinated === "" ||
          pet.vaccinated === filterCriteria.vaccinated) &&
        (filterCriteria.color === "" || pet.color === filterCriteria.color) &&
        (filterCriteria.goodWith === "" || pet.goodWith === filterCriteria.goodWith) &&
        (filterCriteria.size === "" || pet.size === filterCriteria.size) &&
        (filterCriteria.type === "" || pet.type === filterCriteria.type)&&
        (filterCriteria.city === "" || pet.city === filterCriteria.city)
      );
    });
    setFilteredPets(filtered);
  };

  // Call applyFilters whenever filterCriteria changes
  useEffect(() => {
    applyFilters();
  }, [filterCriteria]);

  // Update the filter criteria in state when a filter changes
  const handleFilterChange = (filterName, value) => {
    console.log(value);
    if (filterName === "age") {
      setFilterCriteria({ ...filterCriteria, [filterName]: parseInt(value) });
    } else {
      setFilterCriteria({ ...filterCriteria, [filterName]: value });
    }
  };

  return (
    <div className="petsearchpage_cont1">
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        Meet your new pet!
      </motion.h1>
      <div className="petsearchpage_cont">
        <Filters
          filteredAgeHandler={(e) => handleFilterChange("age", e.target.value)}
          filteredGenderHandler={(e) =>
            handleFilterChange("gender", e.target.value)
          }
          filteredColorHandler={(e) =>
            handleFilterChange("color", e.target.value)
          }
          filteredSizeHandler={(e) =>
            handleFilterChange("size", e.target.value)
          }
          filteredVacccinatedHandler={(e) =>
            handleFilterChange("vaccinated", e.target.value)
          }
          filteredSterilizedHandler={(e) =>
            handleFilterChange("sterilized", e.target.value)
          }
          filteredtypeHandler={(e) =>
            handleFilterChange("type", e.target.value)
          }
          filteredGoodWithHandler={(e) =>
            handleFilterChange("goodWith", e.target.value)
          }
          filteredDaysonSiteHandler={(e) =>
            handleFilterChange("daysOnSite", e.target.value)
          }
          filteredCityHandler={(e) =>
            handleFilterChange("city", e.target.value)
          }
          resetFiltersHandler={resetFilters}
          filterCriteria={filterCriteria}
        />

        <PetList filteredPets={filteredPets} loading={loading} />
      </div>{" "}
    </div>
  );
};

export default PetSearch;
