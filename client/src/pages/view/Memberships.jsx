import React from 'react'
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "./layout/Header";
import { Footer } from "./layout/Footer";
import { Users } from "lucide-react";
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';


const Memberships = () => {
    const [loader, setLoader] = useState(false);
    const navigate = useNavigate();
    const [memberships, setMemberships] = useState([]);

    useEffect(() => {
        const getMemberships = async () => {
            setLoader(true);
            const membershipsResponse = await fetch(`${process.env.REACT_APP_HOST_URL}/memberships`);
            const membershipsData = await membershipsResponse.json();
            setMemberships(membershipsData.data.sort((a, b) => a.id - b.id));
            setLoader(false);
        }  
        getMemberships();
    },[])

    const upgradePlan = (planId, pTitle, planName ,planAmount) => {
      setLoader(true);
      navigate(`/checkout`,
        {
          state: {
            membership_id: planId,
            membership_name: pTitle,
            plan_amount: planAmount,
            plan_name: planName
          }
        }
      );

    }
    
  return (
    <main className="w-full h-auto bg-gray-100">
      <Header />
      <div className="main-container ml-auto mr-auto md:mt-10 mt-4 md:pt-20 pt-10 md:pb-10 pb-6 mb-6 md:mb-10 sm:mb-6 flex flex-col items-center justify-center page">
        <section className="py-6 md:py-0 md:px-0 px-4">
          <div className="container">
            <h2 className="text-center text-[#1d1d1d] text-2xl font-medium mb-4">
              Upgrade your plan
            </h2>
            <p className="text-center text-[#1d1d1d] text-sm font-normal max-w-3xl mx-auto">
              Unlock exclusive benefits, premium features, and unlimited access with our flexible membership plans tailored to your needs.
            </p>
          </div>
        </section>

        <section className="py-12">
          <div className="container">
            {loader ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '30vh' }}>
                <CircularProgress />
              </Box>
            ) : (
            <div className="grid  justify-center gap-6 px-4 md:grid-cols-2 lg:grid-cols-4 grid-cols-1">
              {/* Placeholder for Membership Cards */}
              {memberships.map((membership) => (
                <div key={membership.id} className="relative w-full min-w-0 flex-1 flex md:max-w-96 justify-self-center min-[52rem]:order-1 min-[90rem]:order-none" data-testid="free-pricing-modal-column-wrapper">
                    {/* border rgba(255, 255, 255, 0.15) */}
                    <div className="border-s p-[23px] border-e border-t border-b border-[#00000026]  bg-gray-200 md:min-h-[30rem] md:max-w-96 md:rounded-none md:border-e-0 md:pb-6 md:first:rounded-ss-xl md:first:rounded-es-xl md:last:rounded-se-xl md:last:rounded-ee-xl md:last:border-e relative z-10 flex h-full w-full flex-1 flex-col text-sm transition-colors duration-200 ease-out justify-start gap-6 rounded-3xl px-[23px]! pt-[23px]! pb-[25px]! [box-shadow:0_4px_8px_rgba(0,0,0,0.05)] md:rounded-3xl! md:mt-0! md:mb-0! md:rounded-3xl! md:border! border-token-border-default! bg-token-main-surface-primary [&amp;_[data-testid$='-pricing-column-cost']]:mt-3 [&amp;_[data-testid$='-pricing-column-cost-skeleton']]:mt-3">
                    <div type="standard" className="relative flex flex-col bg-token-main-surface-primary dark:bg-transparent pricing-column-top-half mt-0" data-pricing-plan-type="free" data-testid="free-pricing-modal-column-top-half">
                        <div className="pricing-column-top-stack flex flex-col gap-5 rounded-2xl gap-0!" data-pricing-column-top-stack="">
                            <div className="pricing-column-label-row relative flex items-start justify-between gap-2 h-8 min-h-8">
                                <h3 id="_r_8j_" data-pricing-column-plan-heading="" data-testid="pricing-column-plan-name" className="pricing-column-plan-heading flex min-w-0 grow items-start justify-between gap-2 font-oai text-lg leading-8 font-semibold tracking-[-0.18px]">
                                    <span className="flex min-w-0 flex-wrap text-[#1d1d1d] items-baseline gap-x-2 gap-y-1">
                                        {membership.plans[0].name}
                                    </span>
                                </h3>
                            </div>
                            <div className="mt-6 flex flex-col gap-3">
                                <p className="text-[#1d1d1d] min-h-8 text-[28px] leading-[34px] font-semibold tracking-[-0.39px]" data-testid="pricing-column-headline">{membership.title}</p> 
                            </div>
                            <div className="pricing-column-price-block relative flex items-end gap-1.5 mt-3! min-h-[85px]" data-testid="free-pricing-column-cost">
                                <div className="flex items-start text-[#1d1d1d]">
                                    <span className="sr-only">Rs&nbsp;{membership.plans[0].amount}</span>
                                    <span aria-hidden="true" className="text-[56px] leading-none font-normal tracking-[-0.6px]">₨</span>
                                    {/* comma like 1,000 */}
                                    <span aria-hidden="true" className="text-[56px] leading-none font-normal tracking-[-0.6px]">&nbsp;{membership.plans[0].amount}</span>
                                </div>
                                <div className="flex items-baseline gap-1.5">
                                    <div className="pricing-column-price-frequency mt-auto mb-0.5 flex h-full flex-col items-start justify-end pb-0.5">
                                        <p className="text-[#1e1e1e] w-full text-base leading-[26px] font-normal tracking-[-0.32px]">
                                            {membership.duration && (
                                                <span className="flex min-w-0 capitalize flex-wrap text-[#1d1d1d]  items-baseline gap-x-2 gap-y-1"> 
                                                    / {membership.duration === '1' ? 'Day' : membership.duration === '30' ? 'Month' : membership.duration === '180' ? 'Half Year' : '1 Year'} 
                                                </span>
                                            )}
                                        </p>
                                        <p className="text-[#cdcdcd] text-xs"></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="w-full mb-2">
                        <button className=" bg-orange-400 text-gray-100 min-h-[48px] rounded-full btn relative group-focus-within/dialog:focus-visible:[outline-width:1.5px] group-focus-within/dialog:focus-visible:[outline-offset:2.5px] group-focus-within/dialog:focus-visible:[outline-style:solid] group-focus-within/dialog:focus-visible:[outline-color:var(--text-primary)] btn-secondary btn-large btn-secondary disabled:bg-token-bg-primary w-full" disabled="" 
                          onClick={ () => upgradePlan(membership.id, membership.title, membership.plans[0].name, membership.plans[0].amount)}
                          data-visually-disabled="">
                            <div className="flex items-center justify-center">
                                &nbsp;{membership.plans[0].amount > 0 ? `Purchase Plan` : 'Free'}
                            </div>
                        </button>
                    </div>
                    <div className="flex flex-col grow gap-2 grow-0!" data-pricing-column-feature-list="">
                        <div className="tiptap tiptap-frontend tiptap-membership" data-testid="pricing-column-feature-section">
                            <div dangerouslySetInnerHTML={{ __html: membership.description }} ></div>
                        </div>
                    </div>
                    <div data-testid="pricing-column-redesign-disclaimer-footer" className="mt-auto flex w-full flex-col justify-end leading-4 font-normal tracking-[-0.1px] text-[#1d1d1d] dark:text-[#1f1f1f] [&amp;_a]:font-medium [&amp;_a]:tracking-normal [&amp;_a]:text-token-text-secondary [&amp;_a]:underline!">
                        <div type="standard" className="relative flex flex-col text-xs text-token-text-secondary bg-token-main-surface-primary dark:bg-transparent gap-0.5 pt-1">
                            <div>Want to know more? <a className="font-medium underline" href="/contact" target="_blank">Go to Chat</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
              ))}
            </div>
            )}
          </div>
        </section>
        <section className="w-full h-full">
          <div className="w-full h-full flex flex-col items-center justify-center mx-auto h-full md:px-10 px-3">
            <div>
                <div className="mb-4 flex flex-col gap-2 items-center ">
                  <Users size={24} color="black" />
                  <span className="text-sm font-medium">Membership Benefits</span>
                  <p className="text-sm font-medium">Explore topics in depth with longer conversations</p>
                </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </main>
  )
}

export default Memberships