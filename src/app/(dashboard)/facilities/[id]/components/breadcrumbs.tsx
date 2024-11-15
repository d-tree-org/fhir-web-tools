"use client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { usePathname, useSelectedLayoutSegments } from "next/navigation";

const getLinkList = (base: string, segments: string[]) => {
  segments.pop();
  const links = segments.map((segment, index) => ({
    link: `${base}/${segment}`,
    name: segment,
  }));
  links.unshift({ link: base, name: "Facility" });
  return links.map((segment, index) => {
    return (
      <>
        <BreadcrumbItem key={index}>
          <BreadcrumbLink href={segment.link}>{segment.name}</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator className="hidden md:block" />
      </>
    );
  });
};

export const AppBreadCrumbs = () => {
  const pathname = usePathname();
  const segments = useSelectedLayoutSegments();

  const splitPathname = pathname.split("/");

  const basePath = splitPathname
    .slice(0, splitPathname.length - segments.length)
    .join("/");
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {getLinkList(basePath, [...segments])}
        <BreadcrumbItem>
          <BreadcrumbPage>
            {splitPathname[splitPathname.length - 1]}
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
};
