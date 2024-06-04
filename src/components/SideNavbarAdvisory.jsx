import React from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import {
  MdOutlineSpaceDashboard,
  MdAccountBalance,
  MdOutlinePayments
} from "react-icons/md";
import { FaWpforms, FaFileContract, FaProjectDiagram, FaRegChartBar } from "react-icons/fa";

function SideNavbarAdvisory() {
  return (
    <div>
      <div className="p-0 w-1/7 h-288px bg-white relative lg:left-0 lg:w-48 peer-focus:left-0 ">
        <div className="flex flex-col justify-start item-center">
          <div className=" my-0 border-b border-gray-100 pb-4">
            <LinkContainer to="/advisory/dashboard" >
              <a className="flex mb-0 justify-start items-center gap-1 pl-2 hover:bg-blue-700 p-0 rounded-md group cursor-pointer hover:shadow-lg m-auto">
                <MdOutlineSpaceDashboard className="text-2xl text-gray-600 group-hover:text-white ml-2" />
                <h3 className="text-base text-gray-800 group-hover:text-white font-semibold mt-2">
                  Dashboard
                </h3>
              </a>
            </LinkContainer>
            <LinkContainer to="/advisory/clientproforms">
              <a className="flex mb-0 justify-start items-center gap-1 pl-2 hover:bg-blue-700 p-0 rounded-md group cursor-pointer hover:shadow-lg m-auto">
                <FaWpforms className="text-2xl text-gray-600 group-hover:text-white ml-2" />
                <h3 className="text-base text-gray-800 group-hover:text-white font-semibold mt-2">
                  Proforms
                </h3>
              </a>
            </LinkContainer>
            <div>
              <LinkContainer to="/advisory/clientcontracts">
                <a className="flex mb-0 justify-start items-center gap-1 pl-2 hover:bg-blue-700 p-0 rounded-md group cursor-pointer hover:shadow-lg m-auto">
                  <FaFileContract className="text-2xl text-gray-600 group-hover:text-white ml-2" />
                  <h3 className="text-base text-gray-800 group-hover:text-white font-semibold mt-2">
                    Contracts
                  </h3>
                </a>
              </LinkContainer>
              <div className="focused-within-parent:h-[108px] hovered-parent:h-[108px] focused-within-parent:mt-1 hovered-parent:mt-1 transition-height duration-100 h-0 overflow-hidden flex flex-col">
                <LinkContainer to="/advisory/clientcontractcreatebasedproform">
                  <a className="flex w-full ml-8 mb-0 gap-1 pl-0 hover:bg-gray-100 p-0 rounded-md group cursor-pointer hover:shadow-lg m-auto">
                    <h4 className="text-gray-800 group-hover:text-blue-700 font-bold mt-0 text-xs ml-8">Create Contract based in Proforms</h4>
                  </a>
                </LinkContainer>
                <LinkContainer to="/advisory/clientcontracttypes">
                  <a className="flex w-full ml-0 mb-0 gap-1 pl-1 hover:bg-gray-100 p-1 rounded-md group cursor-pointer hover:shadow-lg m-auto">
                    <h4 className="text-gray-800 group-hover:text-blue-700 font-bold mt-0 text-xs ml-7">Contract Types</h4>
                  </a>
                </LinkContainer>
                <LinkContainer to="/advisory/clientcontractclauses">
                  <a className="flex w-full ml-0 mb-0 gap-1 pl-1 hover:bg-gray-100 p-1 rounded-md group cursor-pointer hover:shadow-lg m-auto">
                    <h4 className="text-gray-800 group-hover:text-blue-700 font-bold mt-0 text-xs ml-7">Contract Clauses</h4>
                  </a>
                </LinkContainer>
              </div>
            </div>
            <LinkContainer to="/advisory/clientaccounts">
              <a className="flex mb-0 justify-start items-center gap-1 pl-2 hover:bg-blue-700 p-0 rounded-md group cursor-pointer hover:shadow-lg m-auto">
                <MdAccountBalance className="text-2xl text-gray-600 group-hover:text-white ml-2" />
                <h3 className="text-base text-gray-800 group-hover:text-white font-semibold mt-2">
                  Accounts
                </h3>
              </a>
            </LinkContainer>
            <LinkContainer to="/advisory/projects">
              <a className="flex mb-0 justify-start items-center gap-1 pl-2 hover:bg-blue-700 p-0 rounded-md group cursor-pointer hover:shadow-lg m-auto">
                <FaProjectDiagram className="text-2xl text-gray-600 group-hover:text-white ml-2" />
                <h3 className="text-base text-gray-800 group-hover:text-white font-semibold mt-2">
                  Projects
                </h3>
              </a>
            </LinkContainer>
            <LinkContainer to="/advisory/collections">
              <a className="flex mb-0 justify-start items-center gap-1 pl-2 hover:bg-blue-700 p-0 rounded-md group cursor-pointer hover:shadow-lg m-auto">
                <MdOutlinePayments className="text-2xl text-gray-600 group-hover:text-white ml-2" />
                <h3 className="text-base text-gray-800 group-hover:text-white font-semibold mt-2">
                  Collections
                </h3>
              </a>
            </LinkContainer>
            <div>
              <LinkContainer to="/advisory/statistics">
                <a className="flex mb-0 justify-start items-center gap-1 pl-2 hover:bg-blue-700 p-0 rounded-md group cursor-pointer hover:shadow-lg m-auto">
                  <FaRegChartBar className="text-2xl text-gray-600 group-hover:text-white ml-2" />
                  <h3 className="text-base text-gray-800 group-hover:text-white font-semibold mt-2">
                    Statistics
                  </h3>
                </a>
              </LinkContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SideNavbarAdvisory;