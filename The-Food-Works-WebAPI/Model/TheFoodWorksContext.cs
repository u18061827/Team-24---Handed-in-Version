using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

#nullable disable

namespace The_Food_Works_WebAPI.Model
{
    public partial class TheFoodWorksContext : DbContext
    {
        public TheFoodWorksContext()
        {
        }

        public TheFoodWorksContext(DbContextOptions<TheFoodWorksContext> options)
            : base(options)
        {
        }

        public virtual DbSet<Audit> Audits { get; set; }
        public virtual DbSet<Batch> Batches { get; set; }
        public virtual DbSet<BatchLine> BatchLines { get; set; }
        public virtual DbSet<BatchStatus> BatchStatuses { get; set; }
        public virtual DbSet<Branch> Branches { get; set; }
        public virtual DbSet<BranchAddress> BranchAddresses { get; set; }
        public virtual DbSet<BranchProduct> BranchProducts { get; set; }
        public virtual DbSet<BranchRequest> BranchRequests { get; set; }
        public virtual DbSet<BranchRequestLine> BranchRequestLines { get; set; }
        public virtual DbSet<Cart> Carts { get; set; }
        public virtual DbSet<CartLine> CartLines { get; set; }
        public virtual DbSet<CompletionMethod> CompletionMethods { get; set; }
        public virtual DbSet<CookingList> CookingLists { get; set; }
        public virtual DbSet<Customer> Customers { get; set; }
        public virtual DbSet<CustomerAddress> CustomerAddresses { get; set; }
        public virtual DbSet<Delivery> Deliveries { get; set; }
        public virtual DbSet<Employee> Employees { get; set; }
        public virtual DbSet<EmployeeTrainingModule> EmployeeTrainingModules { get; set; }
        public virtual DbSet<LoyaltyDate> LoyaltyDates { get; set; }
        public virtual DbSet<LoyaltyPercentage> LoyaltyPercentages { get; set; }
        public virtual DbSet<OrderMethod> OrderMethods { get; set; }
        public virtual DbSet<PaymentType> PaymentTypes { get; set; }
        public virtual DbSet<Product> Products { get; set; }
        public virtual DbSet<ProductContent> ProductContents { get; set; }
        public virtual DbSet<ProductPrice> ProductPrices { get; set; }
        public virtual DbSet<ProductReview> ProductReviews { get; set; }
        public virtual DbSet<ProductStatus> ProductStatuses { get; set; }
        public virtual DbSet<ProductType> ProductTypes { get; set; }
        public virtual DbSet<RedeemedInstance> RedeemedInstances { get; set; }
        public virtual DbSet<RequestStatus> RequestStatuses { get; set; }
        public virtual DbSet<Sale> Sales { get; set; }
        public virtual DbSet<SaleLine> SaleLines { get; set; }
        public virtual DbSet<SalePaymentType> SalePaymentTypes { get; set; }
        public virtual DbSet<SaleStatus> SaleStatuses { get; set; }
        public virtual DbSet<SaleType> SaleTypes { get; set; }
        public virtual DbSet<Supplier> Suppliers { get; set; }
        public virtual DbSet<SupplierAddress> SupplierAddresses { get; set; }
        public virtual DbSet<SupplierOrder> SupplierOrders { get; set; }
        public virtual DbSet<SupplierOrderDay> SupplierOrderDays { get; set; }
        public virtual DbSet<SupplierOrderLine> SupplierOrderLines { get; set; }
        public virtual DbSet<SupplierOrderStatus> SupplierOrderStatuses { get; set; }
        public virtual DbSet<SupplierStatus> SupplierStatuses { get; set; }
        public virtual DbSet<SupplierType> SupplierTypes { get; set; }
        public virtual DbSet<TrainingModule> TrainingModules { get; set; }
        public virtual DbSet<TrainingModuleType> TrainingModuleTypes { get; set; }
        public virtual DbSet<User> Users { get; set; }
        public virtual DbSet<UserPasswordHistory> UserPasswordHistories { get; set; }
        public virtual DbSet<UserRole> UserRoles { get; set; }
        public virtual DbSet<UserStatus> UserStatuses { get; set; }
        public virtual DbSet<Vat> Vats { get; set; }
        public virtual DbSet<Voucher> Vouchers { get; set; }
        public virtual DbSet<WriteOff> WriteOffs { get; set; }
        public virtual DbSet<WriteOffProduct> WriteOffProducts { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                optionsBuilder.UseSqlServer("Name=TheFoodWorksDB");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.HasAnnotation("Relational:Collation", "SQL_Latin1_General_CP1_CI_AS");

            modelBuilder.Entity<Audit>(entity =>
            {
                entity.HasNoKey();

                entity.ToTable("Audit");

                entity.Property(e => e.Action)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.Controller)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.Id).ValueGeneratedOnAdd();

                entity.Property(e => e.QueryString)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.RequestBody).IsUnicode(false);
            });

            modelBuilder.Entity<Batch>(entity =>
            {
                entity.ToTable("batch");

                entity.Property(e => e.BatchId)
                    .ValueGeneratedNever()
                    .HasColumnName("batch_id");

                entity.Property(e => e.BatchStatusId).HasColumnName("batch_status_id");

                entity.Property(e => e.CookingListId).HasColumnName("cooking_list_id");

                entity.Property(e => e.EmployeeId).HasColumnName("employee_id");

                entity.HasOne(d => d.BatchStatus)
                    .WithMany(p => p.Batches)
                    .HasForeignKey(d => d.BatchStatusId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_batch_batch_status");

                entity.HasOne(d => d.CookingList)
                    .WithMany(p => p.Batches)
                    .HasForeignKey(d => d.CookingListId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_batch_cooking_list");

                entity.HasOne(d => d.Employee)
                    .WithMany(p => p.Batches)
                    .HasForeignKey(d => d.EmployeeId)
                    .HasConstraintName("FK_batch_employee");
            });

            modelBuilder.Entity<BatchLine>(entity =>
            {
                entity.HasKey(e => new { e.ProductId, e.BatchId });

                entity.ToTable("batch_line");

                entity.Property(e => e.ProductId).HasColumnName("product_id");

                entity.Property(e => e.BatchId).HasColumnName("batch_id");

                entity.Property(e => e.Quantity).HasColumnName("quantity");

                entity.HasOne(d => d.Batch)
                    .WithMany(p => p.BatchLines)
                    .HasForeignKey(d => d.BatchId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_batch_line_batch");

                entity.HasOne(d => d.Product)
                    .WithMany(p => p.BatchLines)
                    .HasForeignKey(d => d.ProductId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_batch_line_product");
            });

            modelBuilder.Entity<BatchStatus>(entity =>
            {
                entity.ToTable("batch_status");

                entity.Property(e => e.BatchStatusId)
                    .ValueGeneratedNever()
                    .HasColumnName("batch_status_id");

                entity.Property(e => e.BatchStatusName)
                    .IsRequired()
                    .HasMaxLength(30)
                    .IsUnicode(false)
                    .HasColumnName("batch_status_name");
            });

            modelBuilder.Entity<Branch>(entity =>
            {
                entity.ToTable("branch");

                entity.Property(e => e.BranchId).HasColumnName("branch_id");

                entity.Property(e => e.BranchContactNumber)
                    .IsRequired()
                    .HasMaxLength(10)
                    .IsUnicode(false)
                    .HasColumnName("branch_contact_number");

                entity.Property(e => e.BranchEmailAddress)
                    .IsRequired()
                    .HasMaxLength(50)
                    .IsUnicode(false)
                    .HasColumnName("branch_email_address");

                entity.Property(e => e.BranchImage)
                    .HasMaxLength(500)
                    .IsUnicode(false)
                    .HasColumnName("branch_image");

                entity.Property(e => e.BranchName)
                    .IsRequired()
                    .HasMaxLength(20)
                    .IsUnicode(false)
                    .HasColumnName("branch_name");

                entity.Property(e => e.BranchStatus).HasColumnName("branch_status");
            });

            modelBuilder.Entity<BranchAddress>(entity =>
            {
                entity.ToTable("branch_address");

                entity.Property(e => e.BranchAddressId).HasColumnName("branch_address_id");

                entity.Property(e => e.BranchAddressFull)
                    .HasMaxLength(500)
                    .IsUnicode(false)
                    .HasColumnName("branch_address_full");

                entity.Property(e => e.BranchCity)
                    .IsRequired()
                    .HasMaxLength(100)
                    .IsUnicode(false)
                    .HasColumnName("branch_city");

                entity.Property(e => e.BranchCountry)
                    .IsRequired()
                    .HasMaxLength(100)
                    .IsUnicode(false)
                    .HasColumnName("branch_country");

                entity.Property(e => e.BranchDate)
                    .HasColumnType("datetime")
                    .HasColumnName("branch_date");

                entity.Property(e => e.BranchId).HasColumnName("branch_id");

                entity.Property(e => e.BranchLate).HasColumnName("branch_late");

                entity.Property(e => e.BranchLng).HasColumnName("branch_lng");

                entity.Property(e => e.BranchProvince)
                    .IsRequired()
                    .HasMaxLength(100)
                    .IsUnicode(false)
                    .HasColumnName("branch_province");

                entity.Property(e => e.BranchStreetName)
                    .IsRequired()
                    .HasMaxLength(100)
                    .IsUnicode(false)
                    .HasColumnName("branch_street_name");

                entity.Property(e => e.BranchSuburb)
                    .IsRequired()
                    .HasMaxLength(100)
                    .IsUnicode(false)
                    .HasColumnName("branch_suburb");

                entity.Property(e => e.BranchZip)
                    .IsRequired()
                    .HasMaxLength(4)
                    .IsUnicode(false)
                    .HasColumnName("branch_zip");

                entity.HasOne(d => d.Branch)
                    .WithMany(p => p.BranchAddresses)
                    .HasForeignKey(d => d.BranchId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_branch_address_branch");
            });

            modelBuilder.Entity<BranchProduct>(entity =>
            {
                entity.HasKey(e => new { e.BranchId, e.ProductId });

                entity.ToTable("branch_product");

                entity.Property(e => e.BranchId).HasColumnName("branch_id");

                entity.Property(e => e.ProductId).HasColumnName("product_id");

                entity.Property(e => e.BaselineQuantity).HasColumnName("baseline_quantity");

                entity.Property(e => e.QuantityOnHand).HasColumnName("quantity_on_hand");

                entity.HasOne(d => d.Branch)
                    .WithMany(p => p.BranchProducts)
                    .HasForeignKey(d => d.BranchId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_branch_product_branch");

                entity.HasOne(d => d.Product)
                    .WithMany(p => p.BranchProducts)
                    .HasForeignKey(d => d.ProductId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_branch_product_product");
            });

            modelBuilder.Entity<BranchRequest>(entity =>
            {
                entity.ToTable("branch_request");

                entity.Property(e => e.BranchRequestId).HasColumnName("branch_request_id");

                entity.Property(e => e.BranchId).HasColumnName("branch_id");

                entity.Property(e => e.BranchRequestDate)
                    .HasColumnType("datetime")
                    .HasColumnName("branch_request_date");

                entity.Property(e => e.RequestStatusId).HasColumnName("request_status_id");

                entity.HasOne(d => d.Branch)
                    .WithMany(p => p.BranchRequests)
                    .HasForeignKey(d => d.BranchId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_branch_request_branch");

                entity.HasOne(d => d.RequestStatus)
                    .WithMany(p => p.BranchRequests)
                    .HasForeignKey(d => d.RequestStatusId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_branch_request_request_status");
            });

            modelBuilder.Entity<BranchRequestLine>(entity =>
            {
                entity.HasKey(e => new { e.BranchRequestId, e.ProductId });

                entity.ToTable("branch_request_line");

                entity.Property(e => e.BranchRequestId).HasColumnName("branch_request_id");

                entity.Property(e => e.ProductId).HasColumnName("product_id");

                entity.Property(e => e.BranchId).HasColumnName("branch_id");

                entity.Property(e => e.RequestedQuantity).HasColumnName("requested_quantity");

                entity.HasOne(d => d.Branch)
                    .WithMany(p => p.BranchRequestLines)
                    .HasForeignKey(d => d.BranchId)
                    .HasConstraintName("FK__branch_re__branc__3A6CA48E");

                entity.HasOne(d => d.BranchRequest)
                    .WithMany(p => p.BranchRequestLines)
                    .HasForeignKey(d => d.BranchRequestId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_branch_request_line_branch_request");

                entity.HasOne(d => d.Product)
                    .WithMany(p => p.BranchRequestLines)
                    .HasForeignKey(d => d.ProductId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_branch_request_line_product");
            });

            modelBuilder.Entity<Cart>(entity =>
            {
                entity.ToTable("cart");

                entity.Property(e => e.CartId)
                    .ValueGeneratedNever()
                    .HasColumnName("cart_id");

                entity.Property(e => e.CustomerId).HasColumnName("customer_id");

                entity.HasOne(d => d.Customer)
                    .WithMany(p => p.Carts)
                    .HasForeignKey(d => d.CustomerId)
                    .HasConstraintName("FK_cart_customer");
            });

            modelBuilder.Entity<CartLine>(entity =>
            {
                entity.HasKey(e => new { e.BranchId, e.ProductId, e.CartId });

                entity.ToTable("cart_line");

                entity.Property(e => e.BranchId).HasColumnName("branch_id");

                entity.Property(e => e.ProductId).HasColumnName("product_id");

                entity.Property(e => e.CartId).HasColumnName("cart_id");

                entity.Property(e => e.Quantity).HasColumnName("quantity");

                entity.HasOne(d => d.Cart)
                    .WithMany(p => p.CartLines)
                    .HasForeignKey(d => d.CartId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_cart_line_cart");

                entity.HasOne(d => d.BranchProduct)
                    .WithMany(p => p.CartLines)
                    .HasForeignKey(d => new { d.BranchId, d.ProductId })
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_cart_line_branch_product");
            });

            modelBuilder.Entity<CompletionMethod>(entity =>
            {
                entity.ToTable("completion_method");

                entity.Property(e => e.CompletionMethodId)
                    .ValueGeneratedNever()
                    .HasColumnName("completion_method_id");

                entity.Property(e => e.CompletionMethodDescription)
                    .IsRequired()
                    .HasMaxLength(30)
                    .IsUnicode(false)
                    .HasColumnName("completion_method_description");
            });

            modelBuilder.Entity<CookingList>(entity =>
            {
                entity.ToTable("cooking_list");

                entity.Property(e => e.CookingListId)
                    .ValueGeneratedNever()
                    .HasColumnName("cooking_list_id");

                entity.Property(e => e.CookingListDate)
                    .HasColumnType("date")
                    .HasColumnName("cooking_list_date");
            });

            modelBuilder.Entity<Customer>(entity =>
            {
                entity.ToTable("customer");

                entity.Property(e => e.CustomerId).HasColumnName("customer_id");

                entity.Property(e => e.CustomerDob)
                    .HasColumnType("date")
                    .HasColumnName("customer_dob");

                entity.Property(e => e.CustomerEmail)
                    .IsRequired()
                    .HasMaxLength(50)
                    .IsUnicode(false)
                    .HasColumnName("customer_email");

                entity.Property(e => e.CustomerName)
                    .IsRequired()
                    .HasMaxLength(50)
                    .IsUnicode(false)
                    .HasColumnName("customer_name");

                entity.Property(e => e.CustomerSurname)
                    .IsRequired()
                    .HasMaxLength(50)
                    .IsUnicode(false)
                    .HasColumnName("customer_surname");

                entity.Property(e => e.CustomerTelephone)
                    .HasMaxLength(10)
                    .IsUnicode(false)
                    .HasColumnName("customer_telephone");

                entity.Property(e => e.IsLoyaltyProgram).HasColumnName("isLoyaltyProgram");
            });

            modelBuilder.Entity<CustomerAddress>(entity =>
            {
                entity.HasKey(e => e.AddressId);

                entity.ToTable("customer_address");

                entity.Property(e => e.AddressId).HasColumnName("address_id");

                entity.Property(e => e.AddressCity)
                    .IsRequired()
                    .HasMaxLength(20)
                    .IsUnicode(false)
                    .HasColumnName("address_city");

                entity.Property(e => e.AddressDate)
                    .HasColumnType("date")
                    .HasColumnName("address_date");

                entity.Property(e => e.AddressLat).HasColumnName("address_lat");

                entity.Property(e => e.AddressLng).HasColumnName("address_lng");

                entity.Property(e => e.AddressPostalCode)
                    .IsRequired()
                    .HasMaxLength(4)
                    .IsUnicode(false)
                    .HasColumnName("address_postal_code");

                entity.Property(e => e.AddressProvince)
                    .IsRequired()
                    .HasMaxLength(20)
                    .IsUnicode(false)
                    .HasColumnName("address_province");

                entity.Property(e => e.AddressStreetName)
                    .IsRequired()
                    .HasMaxLength(30)
                    .IsUnicode(false)
                    .HasColumnName("address_street_name");

                entity.Property(e => e.AddressStreetNum)
                    .IsRequired()
                    .HasMaxLength(5)
                    .IsUnicode(false)
                    .HasColumnName("address_street_num");

                entity.Property(e => e.CustomerId).HasColumnName("customer_id");

                entity.HasOne(d => d.Customer)
                    .WithMany(p => p.CustomerAddresses)
                    .HasForeignKey(d => d.CustomerId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_customer_address_customer");
            });

            modelBuilder.Entity<Delivery>(entity =>
            {
                entity.ToTable("delivery");

                entity.Property(e => e.DeliveryId).HasColumnName("delivery_id");

                entity.Property(e => e.CustomerSignOff).HasColumnName("customer_sign_off");

                entity.Property(e => e.DeliveryDate)
                    .HasColumnType("date")
                    .HasColumnName("delivery_date");

                entity.Property(e => e.EmployeeId).HasColumnName("employee_id");

                entity.Property(e => e.IsPending).HasColumnName("isPending");

                entity.Property(e => e.SaleId).HasColumnName("sale_id");

                entity.HasOne(d => d.Employee)
                    .WithMany(p => p.Deliveries)
                    .HasForeignKey(d => d.EmployeeId)
                    .HasConstraintName("FK_delivery_employee");

                entity.HasOne(d => d.Sale)
                    .WithMany(p => p.Deliveries)
                    .HasForeignKey(d => d.SaleId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_delivery_sale");
            });

            modelBuilder.Entity<Employee>(entity =>
            {
                entity.ToTable("employee");

                entity.Property(e => e.EmployeeId).HasColumnName("employee_id");

                entity.Property(e => e.BranchId).HasColumnName("branch_id");

                entity.Property(e => e.EmployeeEmail)
                    .HasMaxLength(50)
                    .IsUnicode(false)
                    .HasColumnName("employee_email");

                entity.Property(e => e.EmployeeIdNumber)
                    .IsRequired()
                    .HasMaxLength(13)
                    .IsUnicode(false)
                    .HasColumnName("employee_id_number");

                entity.Property(e => e.EmployeeName)
                    .IsRequired()
                    .HasMaxLength(50)
                    .IsUnicode(false)
                    .HasColumnName("employee_name");

                entity.Property(e => e.EmployeeSurname)
                    .IsRequired()
                    .HasMaxLength(50)
                    .IsUnicode(false)
                    .HasColumnName("employee_surname");

                entity.Property(e => e.EmployeeTelephone)
                    .IsRequired()
                    .HasMaxLength(10)
                    .IsUnicode(false)
                    .HasColumnName("employee_telephone");

                entity.HasOne(d => d.Branch)
                    .WithMany(p => p.Employees)
                    .HasForeignKey(d => d.BranchId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_employee_branch");
            });

            modelBuilder.Entity<EmployeeTrainingModule>(entity =>
            {
                entity.HasKey(e => new { e.TrainingModuleId, e.EmployeeId });

                entity.ToTable("employee_training_module");

                entity.Property(e => e.TrainingModuleId).HasColumnName("training_module_id");

                entity.Property(e => e.EmployeeId).HasColumnName("employee_id");

                entity.Property(e => e.DateCompleted)
                    .HasColumnType("date")
                    .HasColumnName("date_completed");

                entity.Property(e => e.EmployeeTrainingModuleStatus).HasColumnName("employee_training_module_status");

                entity.Property(e => e.TimeElapsed).HasColumnName("time_elapsed");

                entity.HasOne(d => d.Employee)
                    .WithMany(p => p.EmployeeTrainingModules)
                    .HasForeignKey(d => d.EmployeeId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_employee_training_module_employee");

                entity.HasOne(d => d.TrainingModule)
                    .WithMany(p => p.EmployeeTrainingModules)
                    .HasForeignKey(d => d.TrainingModuleId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_employee_training_module_training_module");
            });

            modelBuilder.Entity<LoyaltyDate>(entity =>
            {
                entity.ToTable("loyalty_date");

                entity.Property(e => e.LoyaltyDateId)
                    .ValueGeneratedNever()
                    .HasColumnName("loyalty_date_id");

                entity.Property(e => e.CustomerId).HasColumnName("customer_id");

                entity.Property(e => e.DateJoined)
                    .HasColumnType("date")
                    .HasColumnName("date_joined");

                entity.HasOne(d => d.Customer)
                    .WithMany(p => p.LoyaltyDates)
                    .HasForeignKey(d => d.CustomerId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_loyalty_date_customer");
            });

            modelBuilder.Entity<LoyaltyPercentage>(entity =>
            {
                entity.ToTable("loyalty_percentage");

                entity.Property(e => e.LoyaltyPercentageId)
                    .ValueGeneratedNever()
                    .HasColumnName("loyalty_percentage_id");

                entity.Property(e => e.LoyaltyPercentageAmount).HasColumnName("loyalty_percentage_amount");

                entity.Property(e => e.LoyaltyPercentageDate)
                    .HasColumnType("date")
                    .HasColumnName("loyalty_percentage_date");
            });

            modelBuilder.Entity<OrderMethod>(entity =>
            {
                entity.ToTable("order_method");

                entity.Property(e => e.OrderMethodId)
                    .ValueGeneratedNever()
                    .HasColumnName("order_method_id");

                entity.Property(e => e.OrderMethodName)
                    .IsRequired()
                    .HasMaxLength(10)
                    .IsUnicode(false)
                    .HasColumnName("order_method_name");
            });

            modelBuilder.Entity<PaymentType>(entity =>
            {
                entity.ToTable("payment_type");

                entity.Property(e => e.PaymentTypeId)
                    .ValueGeneratedNever()
                    .HasColumnName("payment_type_id");

                entity.Property(e => e.PaymentTypeDescription)
                    .IsRequired()
                    .HasMaxLength(30)
                    .IsUnicode(false)
                    .HasColumnName("payment_type_description");
            });

            modelBuilder.Entity<Product>(entity =>
            {
                entity.ToTable("product");

                entity.Property(e => e.ProductId)
                    .ValueGeneratedNever()
                    .HasColumnName("product_id");

                entity.Property(e => e.ProductBarcode)
                    .HasMaxLength(50)
                    .IsUnicode(false)
                    .HasColumnName("product_barcode");

                entity.Property(e => e.ProductDescription)
                    .HasMaxLength(100)
                    .IsUnicode(false)
                    .HasColumnName("product_description");

                entity.Property(e => e.ProductImage)
                    .IsUnicode(false)
                    .HasColumnName("product_image");

                entity.Property(e => e.ProductName)
                    .HasMaxLength(50)
                    .IsUnicode(false)
                    .HasColumnName("product_name");

                entity.Property(e => e.ProductStatusId).HasColumnName("product_status_id");

                entity.Property(e => e.ProductTypeId).HasColumnName("product_type_id");

                entity.HasOne(d => d.ProductStatus)
                    .WithMany(p => p.Products)
                    .HasForeignKey(d => d.ProductStatusId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_product_product_status");

                entity.HasOne(d => d.ProductType)
                    .WithMany(p => p.Products)
                    .HasForeignKey(d => d.ProductTypeId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_product_product_type");
            });

            modelBuilder.Entity<ProductContent>(entity =>
            {
                entity.HasKey(e => new { e.ProductId, e.ProductContentId });

                entity.ToTable("product_content");

                entity.Property(e => e.ProductId).HasColumnName("product_id");

                entity.Property(e => e.ProductContentId).HasColumnName("product_content_id");

                entity.Property(e => e.Quantity).HasColumnName("quantity");

                entity.HasOne(d => d.Product)
                    .WithMany(p => p.ProductContents)
                    .HasForeignKey(d => d.ProductId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__product_c__produ__35A7EF71");
            });

            modelBuilder.Entity<ProductPrice>(entity =>
            {
                entity.ToTable("product_price");

                entity.Property(e => e.ProductPriceId)
                    .ValueGeneratedNever()
                    .HasColumnName("product_price_id");

                entity.Property(e => e.BranchId).HasColumnName("branch_id");

                entity.Property(e => e.ProductId).HasColumnName("product_id");

                entity.Property(e => e.ProductPriceAmount).HasColumnName("product_price_amount");

                entity.Property(e => e.ProductPriceDate)
                    .HasColumnType("date")
                    .HasColumnName("product_price_date");

                entity.HasOne(d => d.BranchProduct)
                    .WithMany(p => p.ProductPrices)
                    .HasForeignKey(d => new { d.BranchId, d.ProductId })
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_product_price_branch_product");
            });

            modelBuilder.Entity<ProductReview>(entity =>
            {
                entity.HasKey(e => e.RatingId);

                entity.ToTable("product_review");

                entity.Property(e => e.RatingId).HasColumnName("rating_id");

                entity.Property(e => e.CustomerId).HasColumnName("customer_id");

                entity.Property(e => e.ProductId).HasColumnName("product_id");

                entity.Property(e => e.RatingOverview)
                    .IsUnicode(false)
                    .HasColumnName("rating_overview");

                entity.Property(e => e.RatingStars).HasColumnName("rating_stars");

                entity.HasOne(d => d.Customer)
                    .WithMany(p => p.ProductReviews)
                    .HasForeignKey(d => d.CustomerId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_product_review_customer");

                entity.HasOne(d => d.Product)
                    .WithMany(p => p.ProductReviews)
                    .HasForeignKey(d => d.ProductId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_product_review_product");
            });

            modelBuilder.Entity<ProductStatus>(entity =>
            {
                entity.ToTable("product_status");

                entity.Property(e => e.ProductStatusId)
                    .ValueGeneratedNever()
                    .HasColumnName("product_status_id");

                entity.Property(e => e.ProductStatusName)
                    .IsRequired()
                    .HasMaxLength(20)
                    .IsUnicode(false)
                    .HasColumnName("product_status_name");
            });

            modelBuilder.Entity<ProductType>(entity =>
            {
                entity.ToTable("product_type");

                entity.Property(e => e.ProductTypeId)
                    .ValueGeneratedNever()
                    .HasColumnName("product_type_id");

                entity.Property(e => e.ProductTypeName)
                    .IsRequired()
                    .HasMaxLength(20)
                    .IsUnicode(false)
                    .HasColumnName("product_type_name");
            });

            modelBuilder.Entity<RedeemedInstance>(entity =>
            {
                entity.ToTable("redeemed_instance");

                entity.Property(e => e.RedeemedInstanceId)
                    .ValueGeneratedNever()
                    .HasColumnName("redeemed_instance_id");

                entity.Property(e => e.RedeemedInstanceAmount).HasColumnName("redeemed_instance_amount");

                entity.Property(e => e.RedeemedInstanceDate)
                    .HasColumnType("date")
                    .HasColumnName("redeemed_instance_date");

                entity.Property(e => e.RedeemedInstanceNumber).HasColumnName("redeemed_instance_number");

                entity.Property(e => e.VoucherId).HasColumnName("voucher_id");

                entity.HasOne(d => d.Voucher)
                    .WithMany(p => p.RedeemedInstances)
                    .HasForeignKey(d => d.VoucherId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_redeemed_instance_voucher");
            });

            modelBuilder.Entity<RequestStatus>(entity =>
            {
                entity.ToTable("request_status");

                entity.Property(e => e.RequestStatusId)
                    .ValueGeneratedNever()
                    .HasColumnName("request_status_id");

                entity.Property(e => e.RequestStatusDescription)
                    .IsRequired()
                    .HasMaxLength(20)
                    .IsUnicode(false)
                    .HasColumnName("request_status_description");
            });

            modelBuilder.Entity<Sale>(entity =>
            {
                entity.ToTable("sale");

                entity.Property(e => e.SaleId)
                    .ValueGeneratedNever()
                    .HasColumnName("sale_id");

                entity.Property(e => e.AddressId).HasColumnName("address_id");

                entity.Property(e => e.BranchId).HasColumnName("branch_id");

                entity.Property(e => e.CompletionMethodId).HasColumnName("completion_method_id");

                entity.Property(e => e.CustomerId).HasColumnName("customer_id");

                entity.Property(e => e.DateOfSale)
                    .HasColumnType("date")
                    .HasColumnName("date_of_sale");

                entity.Property(e => e.EmployeeId).HasColumnName("employee_id");

                entity.Property(e => e.SaleStatusId).HasColumnName("sale_status_id");

                entity.Property(e => e.SaleTotal).HasColumnName("sale_total");

                entity.Property(e => e.SaleTypeId).HasColumnName("sale_type_id");

                entity.HasOne(d => d.Address)
                    .WithMany(p => p.Sales)
                    .HasForeignKey(d => d.AddressId)
                    .HasConstraintName("FK_sale_customer_address");

                entity.HasOne(d => d.Branch)
                    .WithMany(p => p.Sales)
                    .HasForeignKey(d => d.BranchId)
                    .HasConstraintName("FK_sale_branch");

                entity.HasOne(d => d.CompletionMethod)
                    .WithMany(p => p.Sales)
                    .HasForeignKey(d => d.CompletionMethodId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_sale_completion_method");

                entity.HasOne(d => d.Customer)
                    .WithMany(p => p.Sales)
                    .HasForeignKey(d => d.CustomerId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_sale_customer");

                entity.HasOne(d => d.Employee)
                    .WithMany(p => p.Sales)
                    .HasForeignKey(d => d.EmployeeId)
                    .HasConstraintName("FK_sale_employee");

                entity.HasOne(d => d.SaleStatus)
                    .WithMany(p => p.Sales)
                    .HasForeignKey(d => d.SaleStatusId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_sale_sale_status");

                entity.HasOne(d => d.SaleType)
                    .WithMany(p => p.Sales)
                    .HasForeignKey(d => d.SaleTypeId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_sale_sale_type");
            });

            modelBuilder.Entity<SaleLine>(entity =>
            {
                entity.HasKey(e => new { e.BranchId, e.ProductId, e.SaleId });

                entity.ToTable("sale_line");

                entity.Property(e => e.BranchId).HasColumnName("branch_id");

                entity.Property(e => e.ProductId).HasColumnName("product_id");

                entity.Property(e => e.SaleId).HasColumnName("sale_id");

                entity.Property(e => e.Quantity).HasColumnName("quantity");

                entity.HasOne(d => d.Sale)
                    .WithMany(p => p.SaleLines)
                    .HasForeignKey(d => d.SaleId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_sale_Line_sale");

                entity.HasOne(d => d.BranchProduct)
                    .WithMany(p => p.SaleLines)
                    .HasForeignKey(d => new { d.BranchId, d.ProductId })
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_sale_Line_branch_product");
            });

            modelBuilder.Entity<SalePaymentType>(entity =>
            {
                entity.HasKey(e => new { e.SaleId, e.PaymentTypeId });

                entity.ToTable("sale_payment_type");

                entity.Property(e => e.SaleId).HasColumnName("sale_id");

                entity.Property(e => e.PaymentTypeId).HasColumnName("payment_type_id");

                entity.Property(e => e.AmountPaid).HasColumnName("amount_paid");

                entity.HasOne(d => d.PaymentType)
                    .WithMany(p => p.SalePaymentTypes)
                    .HasForeignKey(d => d.PaymentTypeId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_sale_payment_type_payment_type");

                entity.HasOne(d => d.Sale)
                    .WithMany(p => p.SalePaymentTypes)
                    .HasForeignKey(d => d.SaleId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_sale_payment_type_sale");
            });

            modelBuilder.Entity<SaleStatus>(entity =>
            {
                entity.ToTable("sale_status");

                entity.Property(e => e.SaleStatusId)
                    .ValueGeneratedNever()
                    .HasColumnName("sale_status_id");

                entity.Property(e => e.SaleStatusDescription)
                    .IsRequired()
                    .HasMaxLength(30)
                    .IsUnicode(false)
                    .HasColumnName("sale_status_description");
            });

            modelBuilder.Entity<SaleType>(entity =>
            {
                entity.ToTable("sale_type");

                entity.Property(e => e.SaleTypeId)
                    .ValueGeneratedNever()
                    .HasColumnName("sale_type_id");

                entity.Property(e => e.SaleTypeDescription)
                    .IsRequired()
                    .HasMaxLength(30)
                    .IsUnicode(false)
                    .HasColumnName("sale_type_description");
            });

            modelBuilder.Entity<Supplier>(entity =>
            {
                entity.ToTable("supplier");

                entity.Property(e => e.SupplierId)
                    .ValueGeneratedNever()
                    .HasColumnName("supplier_id");

                entity.Property(e => e.OrderMethodId).HasColumnName("order_method_id");

                entity.Property(e => e.SupplierAddressId).HasColumnName("supplier_address_id");

                entity.Property(e => e.SupplierContactNumber)
                    .IsRequired()
                    .HasMaxLength(10)
                    .IsUnicode(false)
                    .HasColumnName("supplier_contact_number");

                entity.Property(e => e.SupplierEmailAddress)
                    .HasMaxLength(50)
                    .IsUnicode(false)
                    .HasColumnName("supplier_email_address");

                entity.Property(e => e.SupplierName)
                    .IsRequired()
                    .HasMaxLength(20)
                    .IsUnicode(false)
                    .HasColumnName("supplier_name");

                entity.Property(e => e.SupplierStatusId).HasColumnName("supplier_status_id");

                entity.Property(e => e.SupplierTypeId).HasColumnName("supplier_type_id");

                entity.Property(e => e.SupplierVatNumber)
                    .HasMaxLength(10)
                    .IsUnicode(false)
                    .HasColumnName("supplier_vat_number");

                entity.HasOne(d => d.OrderMethod)
                    .WithMany(p => p.Suppliers)
                    .HasForeignKey(d => d.OrderMethodId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_supplier_order_method");

                entity.HasOne(d => d.SupplierStatus)
                    .WithMany(p => p.Suppliers)
                    .HasForeignKey(d => d.SupplierStatusId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_supplier_supplier_status");

                entity.HasOne(d => d.SupplierType)
                    .WithMany(p => p.Suppliers)
                    .HasForeignKey(d => d.SupplierTypeId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_supplier_supplier_type");
            });

            modelBuilder.Entity<SupplierAddress>(entity =>
            {
                entity.ToTable("supplier_address");

                entity.Property(e => e.SupplierAddressId)
                    .ValueGeneratedNever()
                    .HasColumnName("supplier_address_id");

                entity.Property(e => e.SupplierAddressBuildingNumber)
                    .IsRequired()
                    .HasMaxLength(6)
                    .IsUnicode(false)
                    .HasColumnName("supplier_address_building_number");

                entity.Property(e => e.SupplierAddressCity)
                    .IsRequired()
                    .HasMaxLength(100)
                    .IsUnicode(false)
                    .HasColumnName("supplier_address_city");

                entity.Property(e => e.SupplierAddressCountry)
                    .IsRequired()
                    .HasMaxLength(100)
                    .IsUnicode(false)
                    .HasColumnName("supplier_address_country");

                entity.Property(e => e.SupplierAddressDate)
                    .HasColumnType("datetime")
                    .HasColumnName("supplier_address_date");

                entity.Property(e => e.SupplierAddressFull)
                    .HasMaxLength(500)
                    .IsUnicode(false)
                    .HasColumnName("supplier_address_full");

                entity.Property(e => e.SupplierAddressLat).HasColumnName("supplier_address_lat");

                entity.Property(e => e.SupplierAddressLng).HasColumnName("supplier_address_lng");

                entity.Property(e => e.SupplierAddressProvince)
                    .IsRequired()
                    .HasMaxLength(100)
                    .IsUnicode(false)
                    .HasColumnName("supplier_address_province");

                entity.Property(e => e.SupplierAddressStreetName)
                    .IsRequired()
                    .HasMaxLength(100)
                    .IsUnicode(false)
                    .HasColumnName("supplier_address_street_name");

                entity.Property(e => e.SupplierAddressSuburb)
                    .IsRequired()
                    .HasMaxLength(100)
                    .IsUnicode(false)
                    .HasColumnName("supplier_address_suburb");

                entity.Property(e => e.SupplierAddressZipCode)
                    .IsRequired()
                    .HasMaxLength(4)
                    .IsUnicode(false)
                    .HasColumnName("supplier_address_zip_code");
            });

            modelBuilder.Entity<SupplierOrder>(entity =>
            {
                entity.ToTable("supplier_order");

                entity.Property(e => e.SupplierOrderId)
                    .ValueGeneratedNever()
                    .HasColumnName("supplier_order_id");

                entity.Property(e => e.InvoiceImage)
                    .IsUnicode(false)
                    .HasColumnName("invoice_image");

                entity.Property(e => e.SupplierId).HasColumnName("supplier_id");

                entity.Property(e => e.SupplierOrderDate)
                    .HasColumnType("date")
                    .HasColumnName("supplier_order_date");

                entity.Property(e => e.SupplierOrderStatusId).HasColumnName("supplier_order_status_id");

                entity.HasOne(d => d.Supplier)
                    .WithMany(p => p.SupplierOrders)
                    .HasForeignKey(d => d.SupplierId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_supplier_order_supplier");

                entity.HasOne(d => d.SupplierOrderStatus)
                    .WithMany(p => p.SupplierOrders)
                    .HasForeignKey(d => d.SupplierOrderStatusId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_supplier_order_supplier_order_status");
            });

            modelBuilder.Entity<SupplierOrderDay>(entity =>
            {
                entity.HasKey(e => e.SupplierOrderId);

                entity.ToTable("supplier_order_day");

                entity.Property(e => e.SupplierOrderId)
                    .ValueGeneratedNever()
                    .HasColumnName("supplier_order_id");

                entity.Property(e => e.SupplierId).HasColumnName("supplier_id");

                entity.Property(e => e.SupplierOrderDayDescription)
                    .IsRequired()
                    .HasMaxLength(10)
                    .IsUnicode(false)
                    .HasColumnName("supplier_order_day_description");

                entity.HasOne(d => d.Supplier)
                    .WithMany(p => p.SupplierOrderDays)
                    .HasForeignKey(d => d.SupplierId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_supplier_order_day_supplier");
            });

            modelBuilder.Entity<SupplierOrderLine>(entity =>
            {
                entity.HasKey(e => new { e.ProductId, e.SupplierOrderId });

                entity.ToTable("supplier_order_line");

                entity.Property(e => e.ProductId).HasColumnName("product_id");

                entity.Property(e => e.SupplierOrderId).HasColumnName("supplier_order_id");

                entity.Property(e => e.SupplierOrderLineQuantity).HasColumnName("supplier_order_line_quantity");

                entity.HasOne(d => d.Product)
                    .WithMany(p => p.SupplierOrderLines)
                    .HasForeignKey(d => d.ProductId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_supplier_order_line_product");

                entity.HasOne(d => d.SupplierOrder)
                    .WithMany(p => p.SupplierOrderLines)
                    .HasForeignKey(d => d.SupplierOrderId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_supplier_order_line_supplier_order");
            });

            modelBuilder.Entity<SupplierOrderStatus>(entity =>
            {
                entity.ToTable("supplier_order_status");

                entity.Property(e => e.SupplierOrderStatusId)
                    .ValueGeneratedNever()
                    .HasColumnName("supplier_order_status_id");

                entity.Property(e => e.SupplierOrderStatusName)
                    .IsRequired()
                    .HasMaxLength(10)
                    .IsUnicode(false)
                    .HasColumnName("supplier_order_status_name");
            });

            modelBuilder.Entity<SupplierStatus>(entity =>
            {
                entity.ToTable("supplier_status");

                entity.Property(e => e.SupplierStatusId)
                    .ValueGeneratedNever()
                    .HasColumnName("supplier_status_id");

                entity.Property(e => e.SupplierStatusName)
                    .IsRequired()
                    .HasMaxLength(10)
                    .IsUnicode(false)
                    .HasColumnName("supplier_status_name");
            });

            modelBuilder.Entity<SupplierType>(entity =>
            {
                entity.ToTable("supplier_type");

                entity.Property(e => e.SupplierTypeId)
                    .ValueGeneratedNever()
                    .HasColumnName("supplier_type_id");

                entity.Property(e => e.SupplierTypeName)
                    .IsRequired()
                    .HasMaxLength(10)
                    .IsUnicode(false)
                    .HasColumnName("supplier_type_name");
            });

            modelBuilder.Entity<TrainingModule>(entity =>
            {
                entity.ToTable("training_module");

                entity.Property(e => e.TrainingModuleId).HasColumnName("training_module_id");

                entity.Property(e => e.ContentOrder)
                    .IsUnicode(false)
                    .HasColumnName("content_order");

                entity.Property(e => e.ModuleContentImage)
                    .IsUnicode(false)
                    .HasColumnName("module_content_image");

                entity.Property(e => e.ModuleContentText).HasColumnName("module_content_text");

                entity.Property(e => e.ModuleContentVideo)
                    .HasMaxLength(500)
                    .IsUnicode(false)
                    .HasColumnName("module_content_video");

                entity.Property(e => e.ModuleDescription)
                    .IsRequired()
                    .IsUnicode(false)
                    .HasColumnName("module_description");

                entity.Property(e => e.ModuleDuration)
                    .IsRequired()
                    .HasMaxLength(10)
                    .IsUnicode(false)
                    .HasColumnName("module_duration");

                entity.Property(e => e.ModuleLanguage)
                    .IsRequired()
                    .HasMaxLength(30)
                    .IsUnicode(false)
                    .HasColumnName("module_language");

                entity.Property(e => e.ModuleName)
                    .IsRequired()
                    .HasMaxLength(20)
                    .IsUnicode(false)
                    .HasColumnName("module_name");

                entity.Property(e => e.TrainingModuleTypeId).HasColumnName("training_module_type_id");

                entity.HasOne(d => d.TrainingModuleType)
                    .WithMany(p => p.TrainingModules)
                    .HasForeignKey(d => d.TrainingModuleTypeId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_training_module_training_module_type");
            });

            modelBuilder.Entity<TrainingModuleType>(entity =>
            {
                entity.ToTable("training_module_type");

                entity.Property(e => e.TrainingModuleTypeId)
                    .ValueGeneratedNever()
                    .HasColumnName("training_module_type_id");

                entity.Property(e => e.TrainingModuleTypeDescription)
                    .IsRequired()
                    .HasMaxLength(50)
                    .IsUnicode(false)
                    .HasColumnName("training_module_type_description");
            });

            modelBuilder.Entity<User>(entity =>
            {
                entity.ToTable("user");

                entity.Property(e => e.UserId).HasColumnName("user_id");

                entity.Property(e => e.CustomerId).HasColumnName("customer_id");

                entity.Property(e => e.EmployeeId).HasColumnName("employee_id");

                entity.Property(e => e.OneTimePin).HasColumnName("one_time_pin");

                entity.Property(e => e.UserPassword)
                    .HasMaxLength(1024)
                    .IsUnicode(false)
                    .HasColumnName("user_password");

                entity.Property(e => e.UserRoleId).HasColumnName("user_role_id");

                entity.Property(e => e.UserStatusId).HasColumnName("user_status_id");

                entity.Property(e => e.UserUsername)
                    .HasMaxLength(50)
                    .IsUnicode(false)
                    .HasColumnName("user_username");

                entity.HasOne(d => d.Customer)
                    .WithMany(p => p.Users)
                    .HasForeignKey(d => d.CustomerId)
                    .HasConstraintName("FK_user_customer");

                entity.HasOne(d => d.Employee)
                    .WithMany(p => p.Users)
                    .HasForeignKey(d => d.EmployeeId)
                    .HasConstraintName("FK__user__employee_i__34B3CB38");

                entity.HasOne(d => d.UserRole)
                    .WithMany(p => p.Users)
                    .HasForeignKey(d => d.UserRoleId)
                    .HasConstraintName("FK_user_user_role");

                entity.HasOne(d => d.UserStatus)
                    .WithMany(p => p.Users)
                    .HasForeignKey(d => d.UserStatusId)
                    .HasConstraintName("FK_user_user_status");
            });

            modelBuilder.Entity<UserPasswordHistory>(entity =>
            {
                entity.ToTable("User_Password_History");

                entity.Property(e => e.UserPasswordHistoryId)
                    .ValueGeneratedNever()
                    .HasColumnName("User_Password_History_ID");

                entity.Property(e => e.Date).HasColumnType("date");

                entity.Property(e => e.UserId).HasColumnName("User_Id");
            });

            modelBuilder.Entity<UserRole>(entity =>
            {
                entity.ToTable("user_role");

                entity.Property(e => e.UserRoleId).HasColumnName("user_role_id");

                entity.Property(e => e.UserRoleDescription)
                    .HasMaxLength(150)
                    .IsUnicode(false)
                    .HasColumnName("user_role_description");

                entity.Property(e => e.UserRoleName)
                    .IsRequired()
                    .HasMaxLength(20)
                    .IsUnicode(false)
                    .HasColumnName("user_role_name");
            });

            modelBuilder.Entity<UserStatus>(entity =>
            {
                entity.ToTable("user_status");

                entity.Property(e => e.UserStatusId)
                    .ValueGeneratedNever()
                    .HasColumnName("user_status_id");

                entity.Property(e => e.UserDescription)
                    .IsRequired()
                    .HasMaxLength(10)
                    .IsUnicode(false)
                    .HasColumnName("user_description");
            });

            modelBuilder.Entity<Vat>(entity =>
            {
                entity.ToTable("vat");

                entity.Property(e => e.VatId)
                    .ValueGeneratedNever()
                    .HasColumnName("vat_id");

                entity.Property(e => e.VatDate)
                    .HasColumnType("date")
                    .HasColumnName("vat_date");

                entity.Property(e => e.VatPercentage).HasColumnName("vat_percentage");
            });

            modelBuilder.Entity<Voucher>(entity =>
            {
                entity.ToTable("voucher");

                entity.Property(e => e.VoucherId)
                    .ValueGeneratedNever()
                    .HasColumnName("voucher_id");

                entity.Property(e => e.CustomerId).HasColumnName("customer_id");

                entity.Property(e => e.QrCode)
                    .IsRequired()
                    .HasColumnName("qr_code");

                entity.Property(e => e.VoucherAmount).HasColumnName("voucher_amount");

                entity.Property(e => e.VoucherCode)
                    .IsRequired()
                    .HasMaxLength(15)
                    .IsUnicode(false)
                    .HasColumnName("voucher_code");

                entity.Property(e => e.VoucherExpiryDate)
                    .HasColumnType("date")
                    .HasColumnName("voucher_expiry_date");

                entity.Property(e => e.VoucherStatus).HasColumnName("voucher_status");

                entity.HasOne(d => d.Customer)
                    .WithMany(p => p.Vouchers)
                    .HasForeignKey(d => d.CustomerId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_voucher_customer");
            });

            modelBuilder.Entity<WriteOff>(entity =>
            {
                entity.ToTable("write_off");

                entity.Property(e => e.WriteOffId)
                    .ValueGeneratedNever()
                    .HasColumnName("write_off_id");

                entity.Property(e => e.WriteOffDate)
                    .HasColumnType("date")
                    .HasColumnName("write_off_date");
            });

            modelBuilder.Entity<WriteOffProduct>(entity =>
            {
                entity.HasKey(e => new { e.WriteOffId, e.ProductId, e.BranchId });

                entity.ToTable("write_off_product");

                entity.Property(e => e.WriteOffId).HasColumnName("write_off_id");

                entity.Property(e => e.ProductId).HasColumnName("product_id");

                entity.Property(e => e.BranchId).HasColumnName("branch_id");

                entity.Property(e => e.WriteOffDate)
                    .HasColumnType("date")
                    .HasColumnName("write_off_date");

                entity.Property(e => e.WriteOffQuantity).HasColumnName("write_off_quantity");

                entity.Property(e => e.WriteOffReason)
                    .IsRequired()
                    .HasMaxLength(30)
                    .IsUnicode(false)
                    .HasColumnName("write_off_reason");

                entity.HasOne(d => d.Branch)
                    .WithMany(p => p.WriteOffProducts)
                    .HasForeignKey(d => d.BranchId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_write_off_product_branch");

                entity.HasOne(d => d.Product)
                    .WithMany(p => p.WriteOffProducts)
                    .HasForeignKey(d => d.ProductId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_write_off_product_product");

                entity.HasOne(d => d.WriteOff)
                    .WithMany(p => p.WriteOffProducts)
                    .HasForeignKey(d => d.WriteOffId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_write_off_product_write_off");
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
