import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@chakra-ui/react"
import {ChevronRightIcon} from "@chakra-ui/icons"

export function BreadcrumbCustom() {
    return (
        <Breadcrumb spacing='8px' separator={<ChevronRightIcon color='gray.500' />}>
            <BreadcrumbItem>
                <BreadcrumbLink href='#'>Dashboard</BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbItem isCurrentPage>
                <BreadcrumbLink href='#'>Acceuil</BreadcrumbLink>
            </BreadcrumbItem>
            
        </Breadcrumb>
    )
}